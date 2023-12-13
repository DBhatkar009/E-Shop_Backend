const mongoose = require('mongoose');

// product Model schema
const userSchema = new mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        require: true
    }
});

exports.User = mongoose.model('User', userSchema);