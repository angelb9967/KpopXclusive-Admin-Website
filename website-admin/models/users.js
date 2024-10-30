const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    status: String,
    createdAt: Date,
    updatedAt: Date,
    loginCount: Number
});

module.exports = mongoose.model('users', userSchema);
