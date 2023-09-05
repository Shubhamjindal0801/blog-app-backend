const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    passwordShown: {
        type: String,
        required: true,
    }
},
    {
        strict: false
    }
)

module.exports = Mongoose.model('userdetails', User)