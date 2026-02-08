const mongoose = require('../config/mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        // required: true, its a must that a user provide the email
        unique: true,
        lowercase: true
    },
    password: {
        type: String, //cuase of google auth and other we dont always need the password
    },
    firstName: String, //persoanl info can be provided later on
    lastName : String
},
    {timestamps: true }
)


const User = mongoose.model('user', userSchema);
module.exports = User