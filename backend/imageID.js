const mongoose = require('mongoose');


const imageIDSchema = new mongoose.Schema({
    currentId: Number
});

const ImageIdModel = mongoose.model('imageId', imageIDSchema);

module.exports = ImageIdModel;
