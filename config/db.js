const pg = require('./postgres')
const rethink = require('./rethinkdb')


module.exports = class DatabaseFactory {
    static sql = pg
    static noSQL = rethink;
}