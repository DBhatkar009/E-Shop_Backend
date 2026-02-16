const mongoose = require('mongoose');

// Registration Model Schema
const registrationSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNumber: String,
    dateOfBirth: Date,
    eMailId: String,
    passWord: String
});

exports.Registration = mongoose.model('Registration', registrationSchema);