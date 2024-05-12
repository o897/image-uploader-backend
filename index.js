const express = require('express')
const multer = require('multer')
const cors = require('cors')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()

app.use(express.static('public'))
const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'public');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage})

mongoose.connect(process.env["MONGO_URL"], {
    useNewUrlParser : true,
    useUnifiedTopology : true,
})
.then(() => console.log("Connected to the DB"))
.catch((err) => console.log(err))

const Schema = mongoose.Schema;

// // Define our Schema
const ImageSchema = new Schema({
    filename : String
})

// // Collection name
const ImageModel = mongoose.model("image",ImageSchema)

app.use(cors())

app.get('/', (req,res) => {
    res.send({ message : "server running."})
})


app.get('/api/upload/:filename', (req,res) => {

    const filePath = __dirname + '/public/' + req.params.filename; // relative path
    res.sendFile(filePath); // specify root directory

})
app.post('/upload',upload.single('file'),(req,res) => {

    const file = req.file;

    if(!file) {
        return res.status(400).json({error : 'No file uploaded'})
    }

    // mongoose
    // const newImage = new ImageModel({filename : file.originalname})

    // newImage.save()

    const filePath = path.join(__dirname, file.path)
    // console.log(file.originalname)
    res.json({message : 'Image uploaded successfully' , filePath})
})

app.listen(3003, () => console.log('listening on port 3000'))