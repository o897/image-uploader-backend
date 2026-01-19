const mongoose = require("../config/mongoose");

const date = new Date("UTC+2"); // Set timezone to UTC+2 (South African time)
const createdAt = date.toISOString();

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

// Collection name
const imageModel = mongoose.model("image", ImageSchema);

module.exports = imageModel;
