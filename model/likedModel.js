const mongoose = require("../config/mongoose")

const likedSchema = new mongoose.Schema({
    user : {
        ref : "User",
        type : mongoose.type.ObjectId,
        required : true
    },
    photoId: mongoose.Schema.Types.ObjectId,
    photoUrl: String
},
    { timestamps: true }
)

const likedImage = mongoose.model("like", likedSchema)

module.exports = likedImage 