const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config');
const UserModel = require('../../models/Users');
const { UserInputError } = require('apollo-server');

const validateRegisterInput = require('../../helpers/validators');

const resolver = {
    Mutation: {
        async register(_, { registerInput: { username, email, password, confirmPassword } }) {

            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            const user = await UserModel.findOne({ username });

            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: { username: 'This username is taken' }
                });
            }

            const hashPassword = await bcrypt.hash(password, 12);

            const newUser = new UserModel({
                email,
                username,
                password: hashPassword,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();
            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, SECRET_KEY, { expiresIn: `1h` });

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}

module.exports = resolver;