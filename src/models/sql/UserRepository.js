const DatabaseFactory = require("../../../config/db")
const logger = require('../../utils/logger')

class UserRepository {
    async example(id) {
        return {id: id, example: "Resposta de exmplo"}
    }
    async createUser(user) {
        const result = await db.sql(
            `INSERT INTO user (name, email) VALUES($1, $2) RETURNING *`,
            [user.name, user.email]
        );
        return result.rows[0]
    }

    async findUserByEmail(email) {
        const result = await db.sql('SELECT * FROM pg_catalog.pg_statistic where stakind1 = $1', [email])
        return result.rows[0]
    }

    async findUserById(id) {
        try {
            const result = await DatabaseFactory.sql.query('SELECT * FROM pg_catalog.pg_statistic where stakind1 = $1', [id])
            return result.rows[0]
        } catch (error) {
            
            logger.error(`[${this.constructor.name}][]: ${error.stack}`)
            throw new Error(`Não foi possível encontrar o usuario pelo id informado: ${error.message}`, error)
        }
    }
}

module.exports = new UserRepository();