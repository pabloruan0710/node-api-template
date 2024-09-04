const redisClient = require('redis')
const logger = require('../src/utils/logger');
const Util = require('../src/utils/utils');

const minConnectDelay = 100; // Milliseconds
const maxConnectDelay = 6000; // Milliseconds

class RedisManager {

    constructor() {
        this.connected = false
        this.countRetry = 0
        this.config = {
            disableOfflineQueue: true,
            socket: {
                timeout: 10000,
                connectTimeout: 10000, 
                host: process.env.REDIS_CACHE_HOST,
                port: process.env.REDIS_CACHE_PORT,
                reconnectStrategy: (retries) => {
                    if (retries > Util.env.isDev ? 2 : 10) {
                        logger.error("Too many retries on REDIS. Connection Terminated");
                        return new Error("Too many retries.");
                    } else {
                        const wait = Math.min(minConnectDelay * Math.pow(2, retries), maxConnectDelay);
                        logger.debug("waiting", wait, "milliseconds");
                        return wait;
                    }
                }
            },
        }
        if (!RedisManager.instance) {
            this.client == null;
            RedisManager.instance = this
        }
        return RedisManager.instance
    }

    async initialize() {
        if (!process.env.REDIS_CACHE_ENABLE) {
            logger.warn("Redis cache desabilitado");
            return;
        }
      
        if (this.client) {
            logger.warn("Redis cache já inicializado.");
            return;
        }
        logger.info('Connecting Redis Cache...')
        this.connect()
    }

    getClient() {
        if (!this.client) {
            throw new Error(
              "Redis não incializado. Chame initialize() primeiro."
            );
          }
          return this.client;
    }

    // Conecta ao redis cache
    async connect() {
        if (!this.client) {
            try {
                this.client = redisClient.createClient(this.config)
                
                this.client.on("error", (err) => {
                    this.connected = false
                    logger.error('Error connected to redis:', err);
                    this.countRetry += 1
                    return
                })
                this.client.on('connect',()=>{
                    logger.info('Redis connected.');
                    return
                })
                this.client.on('read',()=>{
                    logger.info('Ready connected to redis');
                    this.connected = true
                    this.countRetry = 0
                    return
                })
                this.client.on('end',()=>{
                    this.connected = false
                    return
                })
                this.client.on('reconnecting', () => {
                    logger.debug('Readis reconnecting...');
                    return;
                });
                await this.client.connect();
            } catch (err) {
                logger.error('Not connected Redis', err)
            }
        }
    }

    // Retorna Cache
    async getCache(key) {
        await this.connect()
        return await this.client
        .multi()
        .ttl(key)
        .get(key)
        .exec()
    }

    // Função para definir dados no Redis
    async setCache(key, value, expiration = process.env.REDIS_CACHE_EXPIRATION) {
        await this.connect()
        await this.client.set(key, value, {
            EX: expiration
        })
    }
}

const instance = new RedisManager();
// Object.freeze(instance);
module.exports = instance;