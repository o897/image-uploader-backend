const mongoose = require('../config/mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String, //cuase of google auth and others we dont always need the password
    },
    firstName: String, //persoanl info can be provided later on
    lastName: String,
    googleAccessToken: String
},
    { timestamps: true }
)


const User = mongoose.model('user', userSchema);
module.exports = User