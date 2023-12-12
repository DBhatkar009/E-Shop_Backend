const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        require: true
    }
});


exports.Order = mongoose.model('Order',orderSchema);