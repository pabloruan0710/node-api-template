const ResponseFormatter = require("../utils/ResponseFormatter")

module.exports = class ErrorMiddleware {

    static error404(req, res, next) {
        res.status(404).json(ResponseFormatter.error(
            ResponseFormatter.dialog(`Not found endpoint 404`), req.originalUrl, null, null, 400
        ))
    }
}