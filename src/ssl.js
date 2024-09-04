const fs = require('fs')
const https = require('https')
const http = require('http')
const logger = require('./utils/logger')

// Carregar certificados SSL
module.exports = function loadSSLCertificate(app) {
    try {
        const privateKey = fs.readFileSync(process.env.SSL_PRIVATEKEY_PATH, 'utf8'); // .key
        const certificate = fs.readFileSync(process.env.SSL_CERTIFICATE_PATH, 'utf8') // .pem or .crt
        const credentials = { key: privateKey, cert: certificate }
        const httpsServer = https.createServer(credentials, app);
        logger.info(`Server started with SSL.`)
        return httpsServer
    } catch {
        const httpServer = http.createServer(app)
        logger.warn(`Server stated without certificate.`)
        return httpServer
    }
}   
