// when creating a new image
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
    numLikes : {
      type : Number,
    },
    // to be added
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
