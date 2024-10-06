import { dbClient, query, transactionQuery } from "../database";

export async function getAllNodes() {

    const nodes = await query(`
        select
        *
        from nodes
        order by id  
    `)

    return nodes.rows
}

export async function getNodeById(nodeId: string) {

    const node = await query(`
        select
        *
        from nodes
        where
        id = $1    
    `, [nodeId])

    if (node.rowCount === 0) {
        throw new Error(`Node with id = ${nodeId} doesn't exist.`)
    }
    return node.rows[0]
}

export async function insertNode(title: string, parentNodeId: string, ordering: number) {
    await transactionQuery(async (client) => {
        await client.query(`
            insert into
            nodes
            ("title", "parent_node_id", "ordering")
            values
            ($1, $2, $3)    
        `, [title, parentNodeId, ordering])
    })
}

export async function updateNode(id: string, title: string) {
    await transactionQuery(async (client) => {
        await client.query(`
            update nodes
            set 
            "title" = $1
            where
            "id" = $2
        `, [title, id])
    })
}

export async function moveNode(id: string, parentNodeId: string) {
    await transactionQuery(async (client) => {
        await client.query(`
            update nodes
            set "parent_node_id" = $1
            where
            "id" = $2    
        `, [parentNodeId, id])
    })
}

export async function changeNodeOrder(id: string, ordering: number, parentNodeId: string) {
    await transactionQuery(async (client) => {
        // const parentNode = await client.query(`
        //     select
        //     *
        //     from nodes
        //     where
        //     "id" = $1    
        // `, [parentNodeId])

        // if (parentNode.rows.length === 0) {
        //     throw new Error(`Parent node doesn't exist.`)
        // }

        const children = await client.query(`
            select
            *
            from nodes
            where 
            "parent_node_id" = $1
            order by "ordering"   
        `, [parentNodeId])

        const nodeIndex = children.rows.findIndex((row: { id: string; }) => row.id === id)

        if (nodeIndex === -1) {
            throw new Error(`Node with id: ${id} doesn't exist.`)
        }

        const node = children.rows[nodeIndex]

        if (ordering < 1 || ordering > children.rows.length + 1) {
            throw new Error(`Invalid new ordering`)
        }

        const newOrderings = children.rows.map((row: {
            ordering: number; id: string
        }, index: number) => {
            if (row.id === id) {
                return ordering
            } else if (index > nodeIndex && row.ordering >= ordering) {
                return row.ordering - 1
            } else {
                return row.ordering
            }
        })

        await client.query(`
            update nodes
            set
            "ordering" = $1
            where 
            "id" = $2    
        `, [ordering, id])

        for (let i = 0; i < newOrderings.length; i++) {
            await client.query(`
                update nodes
                set "ordering" = $1
                where
                "id" = $2    
            `, [newOrderings[i], children.rows[i].id])
        }
    })
}

export async function deleteNode(id: string) {
    await transactionQuery(async (client) => {
        const isRootNode = await client.query(`
            select
            count(*)
            from nodes
            where
            "parent_node_id" is null
            and
            "id" = $1
        `, [id])

        if (isRootNode.rows[0].count > 0) {
            throw new Error(`Cannot delete root node.`)
        }

        const deleteNodeRecursive = async (id: string) => {
            await client.query(`
            delete
            from nodes
            where 
            "id" = $1    
        `, [id])
            const children = await client.query(`
            select
            "id"
            from nodes
            where 
            parent_node_id = $1
        `, [id])
            for (const child of children.rows) {
                await deleteNodeRecursive(child.id)
            }
        }

        await deleteNodeRecursive(id)
    })
}