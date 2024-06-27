const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to the DB"))
.catch((err) => console.log(err))

module.exports = mongoose