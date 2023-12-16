const mongoose = require('mongoose');

// product Model schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    street: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: false
    }

    
});

exports.User = mongoose.model('User', userSchema);