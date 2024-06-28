const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MONGODB"))
.catch((err) => console.log(err))

module.exports = mongoose