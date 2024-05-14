require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
// const mongoose = require('./config/mongoose')
const upload = require('./middleware/multer')
const cloudinary = require('./utils/cloudinary')

app.use(express.static('public'))

// const Schema = mongoose.Schema;

// // Define our Schema
// const ImageSchema = new Schema({
//     filename : String
// })

// // Collection name
// const ImageModel = mongoose.model("image",ImageSchema)

app.use(cors())

app.get('/', (req,res) => {
    res.send({ message : "server running."})
})


app.get('/api/upload/:filename', (req,res) => {

    const filePath = __dirname + '/public/' + req.params.filename; // 
    res.sendFile(filePath); 

})
app.post('/upload',upload.single('file'), (req,res) => {
    const date = new Date().getTime();
    const file = req.file;
    const uploadResult = cloudinary.uploader.upload(req.file.path,{public_id : file.originalname}).catch((error)=>{console.log(error)})

    if(!file) {
        return res.status(400).json({error : 'No file uploaded'})
    }

    // mongoose
    // const newImage = new ImageModel({filename : file.originalname})

    // newImage.save()

    const filePath = path.join(__dirname, file.path)

    res.json({message : 'Image uploaded successfully'})
})

app.listen(3004, () => console.log('listening on port 3000'))