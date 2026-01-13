const mongoose = require('../config/mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
    },
    firstName: String,
    lastName : String
},
    {timestamps: true }
)


const User = mongoose.model('user', userSchema);
module.exports = User