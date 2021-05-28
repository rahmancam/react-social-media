const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config');
const UserModel = require('../../models/Users');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../helpers/validators');

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: `1h` });
}

const resolver = {
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            const user = await UserModel.findOne({ username });

            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'User/Password does not match';
                throw new UserInputError('User/Password does not match', { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(_, { registerInput: { username, email, password, confirmPassword } }) {

            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            let user = await UserModel.findOne({ username });

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

            user = await newUser.save();
            const token = generateToken(user)

            return {
                ...user._doc,
                id: user._id,
                token
            }
        }
    }
}

module.exports = resolver;