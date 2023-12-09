const mongoose = require('mongoose');

// product Model schema
const productSchema = new mongoose.Schema({
    name: String,
    image: String,
    countInStock: Number
});

exports.Product = mongoose.model('Product', productSchema);