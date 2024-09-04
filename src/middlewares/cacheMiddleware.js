const RedisManager = require('../../config/redis')
const logger = require('../utils/logger')

module.exports = class CacheMiddleware {

    static setHeaderExpires(res, ttl) {
        res.set('Expires', new Date(Date.now() + ttl * 1000).toUTCString())
    }

    static cached(timeExpire=process.env.REDIS_CACHE_EXPIRATION) {
        return async function(req, res, next) {
            
            // Só cachear requisições GET
            if (req.method !== 'GET')
                return next()
            
            const cacheKey = req.originalUrl; // Usa a URL da requisição como chave de cache

            if (!process.env.REDIS_CACHE_ENABLE) 
                return next()
            
            if (!RedisManager.client || RedisManager.client.isReady == false)
                return next()
            
            try {
                var cacheData = await RedisManager.getCache(cacheKey)
                if (cacheData && cacheData.length > 1 && cacheData[1]) {
                    try {
                        let ttl = cacheData[0]
                        var cache = JSON.parse(cacheData[1])
                        
                        cache.cached = true
                        logger.debug('✈️ Cache hit for key:', cacheKey)

                        CacheMiddleware.setHeaderExpires(res, ttl)
                        return res.send(cache)
                    } catch (error) {
                        logger.error('Redis cache parse json error:', error)
                        return next() // Erro ao fazer parse de cache
                    }
                }

                 // Modifica o método res.send para armazenar a resposta no cache
                const originalSend = res.send.bind(res)
                res.send = (body) => {

                    if (res.statusCode && (res.statusCode == 200 || res.statusCode == 304)) { // Armazena somente se status code 200
                        RedisManager.setCache(cacheKey, body, timeExpire) //Armazena Cache com TTL de segundos passados
                        CacheMiddleware.setHeaderExpires(res, parseInt(timeExpire))
                    }
                    originalSend(body);
                }
                return next(); // prossegue para a proxima middleware ou rota
            } catch (error) {
                logger.error('Redis GET error:', err)
                return next()
            }
        }
    }
} 