const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    displayName: String,
    userName: String,
    password: String,
    token: String
})

module.exports.User = mongoose.model('users', userSchema, 'users')