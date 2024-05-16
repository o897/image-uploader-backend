require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const mongoose = require('./config/mongoose')
const fileUpload = require("./middleware/multer");
const cloudinary = require("./utils/cloudinary");
const streamifier = require("streamifier");

app.use(express.static("public"));

const Schema = mongoose.Schema;

// Define our Schema
const ImageSchema = new Schema({
    url : String,
    filename : String
})

// // Collection name
const ImageModel = mongoose.model("image",ImageSchema)

app.use(cors());

app.get("/", (req, res) => {
  res.send({ message: "server running." });
});

app.get("/api/upload/:filename", (req, res) => {
  const filePath = __dirname + "/public/" + req.params.filename; //
  res.sendFile(filePath);
});

// app.post('/upload',upload.single('file'), (req,res) => {
//     const uploadResult = cloudinary.uploader.upload(req.file.path ,{public_id : file.originalname}).catch((error)=>{console.log(error)})
//     const filePath = path.join(__dirname, file.path)
//     console.log(uploadResult);
//     res.json({message : 'Image uploaded successfully',uploadResult})
// })

app.get('/api/:image', async (req,res) => {

    console.log(req.params.image);
    const findImage = await ImageModel.findOne({filename : req.param.image})
    
    const results = findImage ? res.json(findImage) : res.send("Image not found.")


})

app.post("/upload", fileUpload.single("file"), (req, res) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    
    let {public_id,secure_url} = result

     // mongoose
     const newImage = new ImageModel({url : secure_url, filename : public_id})
     newImage.save()


    console.log("url image : ",secure_url)
  }

  upload(req);
});

app.listen(3004, () => console.log("listening on port 3000"));
