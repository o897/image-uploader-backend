const mongoose = require('../config/mongoose')

const date = new Date('UTC+2'); // Set timezone to UTC+2 (South African time)
const createdAt = date.toISOString();


const ImageSchema = new mongoose.Schema(
    {
        url: String,
        filename: String,
        userId : String,
        imageTitle : String,
        imageDescription : String,
        createdAt: {
            type: Date,
            default: createdAt
        }
    })

// Collection name
const imageModel = mongoose.model("image", ImageSchema);

module.exports = imageModel