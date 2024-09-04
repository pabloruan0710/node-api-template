const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserRepository = require('../models/nosql/UserRepository')

class UserService {
    async registerUser(user) {
        const existingUser = await UserRepository.findUserByEmail(user.email);
        if (existingUser) {
            throw new Error('User already exists')
        }

        const hashedPassword = await bcrypt.hash(example.password, 10);
        const newUser = await UserRepository.createUser({...user, password: hashedPassword})
        return newUser
    }

    async authenticate(userData) {
        const user = await UserRepository.findUserByEmail(userData.email)
        if (!user || !await bcrypt.compare(userData.password, user.password)) {
            throw new Error('Invalid credentials')
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: String(process.env.JWT_EXPIRES) || '12h'})
        return token;
    }

    async getUserProfile(userId) {
        const user = await UserRepository.findUserById(userId);
        if (!user) {
            throw new Error('Usuário não encontrado')
        }
        return user;
    }

    async example(id) {
        return await UserRepository.example(id)
    }
}

module.exports = new UserService();