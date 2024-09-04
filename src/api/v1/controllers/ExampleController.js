const UserService = require('../../../services/UserService');
const ResponseFormatter = require('../../../utils/ResponseFormatter');

class ExampleController {
    async register(req, res) {
        try {
            const newUser = await UserService.registerUser(req.body)
            res.status(201).json({newUser})
        } catch (error) {
            res.status(500).json({error: error.message })
        }
    }

    async login(req, res) {
        try {
            const token = await UserService.authenticate(req.body);
            res.status(200).json({ token })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    async getProfile(req, res) {
        try {
            const user = await UserService.getUserProfile(req.params.id)
            res.status(200).json(ResponseFormatter.success(user))
        } catch (error) {
            ResponseFormatter.responseError(res, error)
        }
    }

    async example(req, res) {
        try {
            const example = await UserService.example(req.params.id)
            res.status(200).json(ResponseFormatter.success(example))
        } catch (error) {
            ResponseFormatter.responseError(res, error)
        }
    }
}

module.exports = new ExampleController()