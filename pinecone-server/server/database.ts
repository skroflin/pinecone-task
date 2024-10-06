import { Pool, PoolClient, QueryResultRow } from 'pg'

let POOL_INSTANCE: Pool | undefined

async function getPool(): Promise<Pool> {
    if (POOL_INSTANCE) return POOL_INSTANCE
    POOL_INSTANCE = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'pinecone-local',
        password: 'password',
        port: 5432,
    })

    return POOL_INSTANCE
}

export async function dbClient() {
    return (await getPool()).connect()
}

export async function query<T extends QueryResultRow = any>(query: string, args?: any[]): Promise<{ rows: T[]; rowCount: number }> {

    const result = await (await getPool()).query<T>(query, args)
    const rowCount = result.rowCount ?? 0;

    return { rows: result.rows, rowCount };
}

export async function transactionQuery<T>(queries: (client: PoolClient) => Promise<T>) {
    const client = await dbClient()

    try {
        await client.query('BEGIN')
        const result = await queries(client)
        await client.query('COMMIT')
        return result
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
}