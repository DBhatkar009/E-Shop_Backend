const mongoose = require('mongoose');

// product Model schema
const productSchema = new mongoose.Schema({
    name: String,
    image: String,
    model: String,
    price: Number
});

exports.Product = mongoose.model('Product', productSchema);