const mongoose = require("../config/mongoose");

const date = new Date("UTC+2"); // Set timezone to UTC+2 (South African time)
const createdAt = date.toISOString();

<<<<<<< HEAD
const ImageSchema = new mongoose.Schema({
  url: String,
  filename: String,
  owner: String, // who uploaded the image
  imageTitle: String, //if not set take extract the title from pexels
  imageDescription: String, //if not set take extract the title from pexels
  likes: Number,
  createdAt: {
    type: Date,
    default: createdAt,
  },
});
=======

const ImageSchema = new mongoose.Schema(
    {
        url: String,
        filename: String,
        userId : String, 
        imageTitle : String,
        imageDescription : String, //collection
        createdAt: {
            type: Date,
            default: createdAt
        }
    })
>>>>>>> df9a0b3 (oauth works bug was allowed ports)

// Collection name
const imageModel = mongoose.model("image", ImageSchema);

module.exports = imageModel;
