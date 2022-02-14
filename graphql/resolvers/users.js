const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators.js');
const { SECRET_KEY } = require('../../config.js');
const User = require('../../models/User.js');

function tokenGenerate(user){
    return jwt.sign(
        {
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '2h'}
    );
}

module.exports = {
    Mutation: {
        async login(_, { username, password }){
            const {errors, valid} = validateLoginInput(username, password);

            if(!valid) {
                throw new UserInputError('Username or password does not match', { errors });
            }

            const user = await User.findOne({ username });

            if(!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                errors.general = 'Wrong password';
                throw new UserInputError('Wrong password', { errors });
            }

            const token = tokenGenerate(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(_,
            {
                registerInput : {username, email, password, confirmPassword} 
            }, 
        ) {
            //TODO VALIDATE USER DATA
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid) {
                throw new UserInputError('Errors', { errors });
            }
            // TODO Make sure user doesn't already exist
            const user = await User.findOne({ username });
            if(user){
                throw new UserInputError('Username is already used', {
                    errors: {
                        username: 'This username is already taken'
                    }
                })
            }
            // HASH password and create auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username, 
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = tokenGenerate(res)

            return {
                ...res._doc,
                id: res._id,
                token
            };
        }
           
    }
    
};

