const jwt = require('jsonwebtoken')

//  Middleware Pattern
module.exports = class AuthMiddleware {

    static auth(req, res, next) {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).send('Acess Denid, not fout Auth')

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET)
            req.user = verified;
            next();
        } catch (err) {
            res.status(400).send('Invalid token');
        }
    }
}