const mongoose = require('mongoose');


const categorieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
    },
    color: {
        type: String
    }
});

exports.Categorie = mongoose.model('Categories',categorieSchema);