const mongoose = require("../config/mongoose")

const likedSchema = new mongoose.Schema({
    user : {
        ref : "user",
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    photoId : {
        type : String,
        required : true
    },
    photoUrl: String
},
    { timestamps: true }
)

const Like = mongoose.model("like", likedSchema)

module.exports = Like