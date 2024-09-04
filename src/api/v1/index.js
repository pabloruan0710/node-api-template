const express = require('express')
const router = express.Router()
const exampleRoutes = require('./routes/exampleRoutes');

router.use('/example', exampleRoutes)

module.exports = router;
