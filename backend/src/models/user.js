const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true }, // Ensure email is unique
    password: String,
    role: {
        type: String,
        enum: ["admin", "customer"],
        default: 'customer'
    }
});

module.exports = mongoose.model('Userr', userSchema); // Export the User model
