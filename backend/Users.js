const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
    image_id: Number,
    image: String
});

// Create User Model
const UserModel = mongoose.model('imageUpload', userSchema);
module.exports = UserModel;
