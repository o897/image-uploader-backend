const mongoose = require('../config/mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        sparse : true //Only enforce the unique rule if the email actually exists. If the email is null, ignore the unique requirement.
    },
    password: {
        type: String, //cuase of google auth and other we dont always need the password
    },
    firstName: String, //persoanl info can be provided later on
    lastName : String,
    googleAccessToken : String
},
    {timestamps: true }
)


const User = mongoose.model('user', userSchema);
module.exports = User