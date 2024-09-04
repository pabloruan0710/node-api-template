const { Pool } = require("pg");
const logger = require('../src/utils/logger')

class PostgreSQLManager {
    constructor(config) {
        if (!process.env.POSTGRESS_ENABLE) {
            logger.warn('PostgresSQL desabilitado.')
            return
        }
        if (!PostgreSQLManager.instance || PostgreSQLManager.instance.pool) {
            this.pool = new Pool(config || {
                user: process.env.PG_USER,
                host: process.env.PG_HOST,
                database: process.env.PG_DATABASE,
                password: process.env.PG_PASSWORD,
                port: process.env.PG_PORT,
                max: 1200,
                idleTimeoutMillis: 15000
            }); ;
            PostgreSQLManager.instance = this
            logger.info(`Pool PostgresSQL inicializado.`)
        } else {
            logger.warn('PostgresSQL já inicializado.')
        }
        return PostgreSQLManager.instance
    }

    getPool() {
        if (!this.pool) {
            throw new Error('PostgresSQL não inicializado. Chame initialize() primeiro.')
        }
        return this.pool
    }

    async query(text, params) {
        const client = await this.pool.connect();
        try {
          const res = await client.query(text, params);
          return res;
        } catch (err) {
          throw err;
        } finally {
          client.release();
        }
    }

    async close() {
        await this.pool.end();
    }
}

const instance = new PostgreSQLManager()
Object.freeze(instance)
module.exports = instance;