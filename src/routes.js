const logger = require('./utils/logger')
const exampleV1Routes = require('./api/v1')
// const exampleV2Routes = require('./api/v2')

class RoutesManager {

    initialize(app) {
        
        app.use('/api/v1', exampleV1Routes)
        //app.use('/api/v2', exampleV2Routes)

        logger.info('Rotas inicializadas.')
    }

    
}

module.exports = new RoutesManager();