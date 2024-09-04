const DatabaseFactory = require("../../../config/db")
const logger = require('../../utils/logger')

class UserRepository {

    constructor() {
        this.exampleTable = "EXAMPLE"
    }
    
    async findUserById(id) {
        try {
            const result = await DatabaseFactory.noSQL.find(this.exampleTable, {id: parseInt(id)})
            if (result && result.length > 0)
                return result[0]
            return null
        } catch (error) {
            
            logger.error(`[${this.constructor.name}][]: ${error.stack}`)
            throw new Error(`Não foi possível encontrar o usuario pelo id informado: ${error.message}`, error)
        }
    }
    async example(id) {
        return {id: id, example: "Resposta de exmplo"}
    }
}

module.exports = new UserRepository();