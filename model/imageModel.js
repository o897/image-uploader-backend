// const mongoose = require("../config/mongoose");

// const date = new Date("UTC+2"); // Set timezone to UTC+2 (South African time)
// const createdAt = date.toISOString();

// const ImageSchema = new mongoose.Schema({
//   url: String,
//   filename: String,
//   platform : String,
//   thumbnail : String,
//   owner: String, // who uploaded the image
//   imageTitle: String, //if not set take extract the title from pexels
//   imageDescription: String, //if not set take extract the title from pexels
//   likes: Number, //hashtags
//   category : String,
//   createdAt: {
//     type: Date,
//     default: createdAt,
//   },
// });

// // Collection name
// const imageModel = mongoose.model("image", ImageSchema);

// module.exports = imageModel;

const mongoose = require("../config/mongoose");

const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    filename: String,

    platform: {
      type: String,
      enum: ["upload", "tiktok", "youtube", "netflix","facebook"],
      default: "upload",
    },

    thumbnail: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    imageTitle: {
      type: String,
      default: "",
    },

    imageDescription: {
      type: String,
      default: "",
    },

    // upgraded likes system (same name, better structure)
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    category: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true, // replaces your manual createdAt
  }
);

module.exports = mongoose.model("image", ImageSchema);
