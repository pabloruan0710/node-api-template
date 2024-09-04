const { Server } = require('socket.io');
const logger = require('../utils/logger')

class SocketManager {
    constructor() {
        if (!SocketManager.instance) {
          this.io = null;
          SocketManager.instance = this;
        }
    
        return SocketManager.instance;
    }

    /**
     * Inicializa o servidor Socket.IO
     * @param {http.Server} server - Instância do servidor HTTP.
     */
    initialize(server) {
        if (!process.env.SOCKET_ENABLE) {
            logger.warn('Socket.IO desabilitado.')
            return
        }
        if (this.io) {
            logger.warn('Socket.IO já inicializado')
            return
        } else {
            this.io = new Server(server, {
                cors: {
                    origin: '*', // Ajustes conforme necessário
                    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
                },
            });
        }

        logger.info('Socket.IO inicializado.');

        // Defina eventos globais
        this.io.on('connect', function() {
            logger.info('Socket.IO Conectado.')
        })
        this.io.on('connection', (socket) => {
            logger.info(`Novo cliente conectado: ${socket.id}`)
            // Escute por eventos personalizados.
            socket.on('message', (data) => {
                logger.info(`Mensagem recebida do cliente ${socket.id}:`, data)
            })

            socket.on('disconnect', () => {
                logger.info(`Cliente desconectado: ${socket.id}`);
            })
        })
    }

    /**
     * Retorna a instância do Socket.IO
     * @returns {Server} A Instância do Socket.IO
     */
    getIO() {
        if (!this.io) {
            throw new Error('Socket.IO não inicializado. Chame initialize primeiro');
        }
        return this.io;
    }

    emit(event, payload) {
        this.getIO().emit(event, payload)
    }
    emitTo(clientId, event, payload) {
        this.getIO().to(clientId).emit(event, payload)
    }
}

const instance = new SocketManager(); // Instância Singleton
module.exports = instance;

/**
 * Inicialização do Socket
    
const SocketManager = require('./sockets/SocketManager');  // Importando o SocketManager

const app = express();
const server = http.createServer(app);

// Inicializando o Socket.IO com o servidor HTTP
SocketManager.initialize(server);

*/

/**
 * Uso
    const SocketManager = require('../../sockets/SocketManager');

    // Exemplo de função para enviar uma notificação para todos os clientes conectados
    exports.sendNotification = (req, res) => {
    const io = SocketManager.getIO();  // Obtendo a instância do Socket.IO

    const message = 'Nova notificação para todos os clientes!';
    io.emit('notification', message);  // Emitindo evento para todos os clientes conectados

    res.status(200).json({ message: 'Notificação enviada.' });
    };
 */