const postgres = require('../config/postgres')
const rethinkdb = require('../config/rethinkdb')
const redis = require('../config/redis')
const socket = require('./sockets/SocketMananger')

async function clean() {
    try {
        console.log('Called Clean')
        await postgres.close();
        console.log('Database pool has been closed');
        
        await rethinkdb.close()
        console.log('RethinkDB has been closed');

        if (redis.getClient() && redis.connected)
            await redis.getClient().disconnect();
        console.log('Redis has been closed');

        if (socket.getIO()) {
            socket.getIO().close()
            console.log('Todas as conexões Socket.IO foram fechadas.');
        }
        
    } catch (err) {
        console.error(err)
    }
}

process.on('SIGINT', async () => {
    console.error('SIGINT')
    await clean()
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.error('SIGTERM')
    await clean()
    process.exit(0);
})

process.on('uncaughtException', async (err) => {
    console.error('Unhandled exception:', err);
  });
  
process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
});