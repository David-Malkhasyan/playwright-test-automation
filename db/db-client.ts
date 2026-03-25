import sql from 'mssql';
import {Config, DbType} from "../config/config";
import logger from "../utils/logger";

const pools: Map<DbType, sql.ConnectionPool> = new Map();

/**
 * Tracks in-flight pool connection attempts to prevent race conditions
 * (multiple callers creating multiple pools for the same dbType).
 */
const connecting: Map<DbType, Promise<sql.ConnectionPool>> = new Map();

export type QueryParam =
    | unknown
    | {
    name?: string;
    type?: sql.ISqlTypeFactory | sql.ISqlType;
    value: unknown;
};

export type QueryParams = Record<string, any>;

/**
 * Get database connection pool for specified database type
 * @param dbType - Type of database (integration or crm)
 * @returns SQL connection pool
 */
export async function getPool(dbType: DbType): Promise<sql.ConnectionPool> {
    const existing = pools.get(dbType);
    if (existing?.connected) return existing;

    const inFlight = connecting.get(dbType);
    if (inFlight) return inFlight;

    const connectPromise = (async () => {
        const config = Config.getDbConfig(dbType);
        const pool = new sql.ConnectionPool(config);

        // If the pool errors later, drop it so next query can reconnect.
        pool.on('error', (err) => {
            pools.delete(dbType);
            // avoid keeping a rejected/old promise around
            connecting.delete(dbType);
            logger.warn(`⚠️ ${dbType} DB pool error:`, err);
        });

        try {
            await pool.connect();
            pools.set(dbType, pool);
            return pool;
        } catch (err) {
            // Ensure we don't keep a broken pool around
            pools.delete(dbType);
            throw err;
        } finally {
            connecting.delete(dbType);
        }
    })();

    connecting.set(dbType, connectPromise);
    return connectPromise;
}

/**
 * Execute SQL query on specified database
 * @param dbType - Type of database (integration or crm)
 * @param query - SQL query string (supports ? or @named placeholders)
 * @param params - Optional query parameters (object for @named)
 * @returns Query result
 */
export async function runQuery<T = any>(
    dbType: DbType,
    query: string,
    params?: QueryParam[] | QueryParams
): Promise<sql.IResult<T>> {
    const pool = await getPool(dbType);
    const request = pool.request();

    if (params) {
        if (Config.getDbRequestLog()) {
            logger.info(`Executing query on ${dbType} with params: ${JSON.stringify(params)}`);
            logger.info(`SQL: ${query}`);
        }

        // Named parameters as object
        Object.entries(params).forEach(([name, value]) => {
            request.input(name, value);
        });
        try {
            return await request.query<T>(query);
        } catch (err) {
            if (!pool.connected) pools.delete(dbType);
            throw err;
        }
    }

    if (Config.getDbRequestLog()) {
        logger.info(`Executing query on ${dbType} without params`);
        logger.info(`SQL: ${query}`);
    }

    try {
        return await request.query<T>(query);
    } catch (err) {
        if (!pool.connected) pools.delete(dbType);
        throw err;
    }
}

/**
 * Close all database connection pools
 */
export async function closeAllPools(): Promise<void> {
    const entries = Array.from(pools.entries());
    pools.clear();
    connecting.clear();

    const results = await Promise.allSettled(
        entries.map(async ([dbType, pool]) => {
            try {
                await pool.close();
                if (Config.getDbRequestLog()) {
                    logger.info(`✅ Closed ${dbType} DB connection`);
                }
            } catch (err) {
                logger.warn(`⚠️ Failed to close ${dbType} DB connection:`, err);
            }
        })
    );

    // Keep results referenced to avoid "unused" if you later swap logging strategies.
    void results;
}

/**
 * Check if pool is connected
 * @param dbType - Type of database
 * @returns True if connected, false otherwise
 */
export function isPoolConnected(dbType: DbType): boolean {
    const pool = pools.get(dbType);
    return pool ? pool.connected : false;
}