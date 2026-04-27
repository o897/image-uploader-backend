const mongoose = require("../config/mongoose")

const likedSchema = new mongoose.Schema({
    photoId: mongoose.Schema.Types.ObjectId,
    photoUrl: String,
    numLikes : Number,
},
    { timestamps: true }
)

const likedImage = mongoose.model("like", likedSchema)

module.exports = likedImage 