import { dbClient, query, transactionQuery } from "../database";

export async function getAllNodes() {

    const nodes = await query(`
        select
        *
        from nodes
        order by ordering  
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

export async function changeNodeOrder(id: string, newOrdering: number) {
    await transactionQuery(async (client) => {
        const currentNode = await client.query(`
            select
            *
            from nodes 
            where id = $1    
        `, [id])

        if (currentNode.rows.length === 0) {
            throw new Error(`Node with ${id} doesn't exits`)
        }

        const node = currentNode.rows[0]
        const oldOrdering = node.ordering
        const parentNodeId = node.parent_node_id

        if (newOrdering > oldOrdering) {
            await client.query(`
                update nodes
                set ordering - 1
                where parent_node_id = $1
                and ordering > $2 and ordering <= $3    
            `, [parentNodeId, oldOrdering, newOrdering])
        } else if (newOrdering < oldOrdering) {
            await client.query(`
                update nodes 
                set ordering + 1
                where parent_node_id = $1
                and ordering >= $2
                and ordering < $3    
            `, [parentNodeId, newOrdering])
        }

        await client.query(`
            update nodes
            set ordering = $1
            where id = $2    
        `, [newOrdering, id])
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