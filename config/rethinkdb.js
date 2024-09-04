const r = require("rethinkdb");
const logger = require("../src/utils/logger");

class RethinkDBManager {
  constructor() {
    this.config = {
        host: process.env.RTDB_HOST,
        port: process.env.RTDB_PORT,
        db: process.env.RTDB_DATABASE,
        password: process.env.RTDB_PASSWORD,
    };
    if (!RethinkDBManager.instance) {
      this.connection = null;
      RethinkDBManager.instance = this;
    }
    return RethinkDBManager.instance;
  }

  async initialize() {
    if (!process.env.RETHINKDB_ENABLE) {
      logger.warn("RethinkDB desabilitado");
      return;
    }

    if (this.connection) {
      logger.warn("RethinkDB já inicializado.");
      return;
    }

    if (this.config.host === undefined) throw new Error("RethinkDB HOST not found");
    else if (this.config.port === undefined)
      throw new Error("RethinkDB PORT not found");
    else if (this.config.db === undefined)
      throw new Error("RethinkDB DATABASE not found");
    else if (this.config.password === undefined)
      throw new Error("RethinkDB PASS not found");

    logger.info("Conneting RethinkDB...");

    this.connection = await r.connect(this.config).then((con) => {
        logger.info(
            `Connection is succefull in ${this.config.db}-${this.config.host}, RethinkDB.`
        );
        return con;
    });
    
  }

  getConnection() {
    if (!this.connection) {
      throw new Error(
        "RethinkDB não incializado. Chame initialize() primeiro."
      );
    }
    return this.connection;
  }

   // Conectar ao banco de dados
   async connect() {
    if (!this.connection) {
      try {
        this.connection = await r.connect(this.config);
        logger.info('Connected to RethinkDB');
      } catch (err) {
        logger.error('Could not connect to RethinkDB:', err);
        throw err;
      }
    }
  }

  // Fechar a conexão
  async close() {
    if (this.connection) {
      try {
        await this.connection.close();
        logger.info("Connection to RethinkDB closed");
      } catch (err) {
        logger.error("Error closing RethinkDB connection:", err);
      } finally {
        this.connection = null;
      }
    }
  }

  // Inserir dados em uma tabela
  async insert(tableName, data) {
    await this.connect();
    try {
      const result = await r.table(tableName).insert(data).run(this.connection);
      logger.info("Insert result:", result);
      return result;
    } catch (err) {
      logger.error(`Error inserting data into table ${tableName}:`, err);
      throw err;
    }
  }

  // Inserir ou atualizar dados
  async upsert(tableName, data) {
    await this.connect()
    try {
        const result = await r.table(tableName)
            .insert(data, {conflict: 'update'})
            .run(this.connection)

        logger.debug('Upsert result:', result);
        return result;
    } catch (error) {
        logger.error('Error performing upsert:', error)
        throw err
    }
  }

  // Buscar dados de uma tabela
  async find(tableName, filter = {}) {
    await this.connect();
    try {
      const cursor = await r
        .table(tableName)
        .filter(filter)
        .run(this.connection);
      const results = await cursor.toArray();
      logger.debug(`Find result`, results);
      return results;
    } catch (err) {
      logger.error(`Error finding data in table ${tableName}:`, err);
      throw err;
    }
  }

  // Atualizar dados em uma tabela
  async update(tableName, filter, data) {
    await this.connect();
    try {
      const result = await r
        .table(tableName)
        .filter(filter)
        .update(data)
        .run(this.connection);
      logger.debug("Update result:", result);
      return result;
    } catch (err) {
      logger.error(`Error updating data in table ${tableName}:`, err);
      throw err;
    }
  }

  // Deletar dados de uma tabela
  async delete(tableName, filter) {
    await this.connect();
    try {
      const result = await r
        .table(tableName)
        .filter(filter)
        .delete()
        .run(this.connection);
      logger.debug("Delete result:", result);
      return result;
    } catch (err) {
      logger.error(`Error deleting data from table ${tableName}:`, err);
      throw err;
    }
  }
}

const instance = new RethinkDBManager();
//Object.freeze(instance);
module.exports = instance;
