require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const mongoose = require("./config/mongoose");
const fileUpload = require("./middleware/multer");
const cloudinary = require("./utils/cloudinary");
const streamifier = require("streamifier");
const { Console } = require("console");

app.use(express.static("public"));

const Schema = mongoose.Schema;

// Define our Schema
const ImageSchema = new Schema({
  url: String,
  filename: String,
  createdAt : {
    type : Date,
    default: Date.now
  }
});

// // Collection name
const ImageModel = mongoose.model("image", ImageSchema);


app.use(cors({
  origin: 'https://image-uploader-frontend-agg6.onrender.com'
}));

// app.use(cors());

app.get("/", (req, res) => {
  res.send({ message: "server running." });
});

app.get("/api/upload/:filename", (req, res) => {
  const filePath = __dirname + "/public/" + req.params.filename; //
  res.sendFile(filePath);
});


app.get("/api/:image", async (req, res) => {
  const findImage = await ImageModel.findOne({ filename : req.params.image });
  const results = findImage
    ? res.json(findImage)
    : res.json({error : "Image not found"});
});

app.post("/upload", fileUpload.single("file"), (req, res) => {
  const fileName = req.file.originalname;
  
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          // console.log("stream : ",result);
          resolve(result);
        } else {
          reject(error);
        }
      });

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  const currentTime = new Date();
  const timeString = currentTime.toLocaleTimeString();
  
  async function upload(req) {
    let result = await streamUpload(req);
    // console.log("result : ", result);    
    let {secure_url} = result;
     // mongoose
     const newImage = new ImageModel({url : secure_url, filename : fileName});
     newImage.save();
    //  console.log(newImage);
    
  }
  upload(req);
  console.log(timeString);
  

  // how about i return 
});


app.listen(3004, () => console.log("listening on port 3000"));