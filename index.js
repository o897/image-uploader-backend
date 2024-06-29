require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const mongoose = require("./config/mongoose");
const fileUpload = require("./middleware/multer");
const cloudinary = require("./utils/cloudinary");
const streamifier = require("streamifier");

app.use(express.static("public"));

const Schema = mongoose.Schema;

const date = new Date('UTC+2'); // Set timezone to UTC+2 (South African time)
const createdAt = date.toISOString();

// Define our Schema
const ImageSchema = new Schema({
  url: String,
  filename: String,
  createdAt : {
    type : Date,
    default: createdAt
  }
});

// Collection name
const ImageModel = mongoose.model("image", ImageSchema);

// app.use(cors());
// origin : "https://darling-ganache-c749ed.netlify.app",

const allowedOrigins = [
  "https://inquisitive-chimera-40f663.netlify.app",
  "https://image-uploader-frontend-agg6.onrender.com",
  "https://darling-ganache-c749ed.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
}));


// app.use(cors({
//   origin: "https://image-uploader-frontend-agg6.onrender.com",
//   optionsSuccessStatus : 200
// }));


app.get("/", (req, res) => {
  res.send({ message: "server running" });
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
    // the results of how our upload went, and if its ready 

    let {secure_url} = result;
     const newImage = new ImageModel({url : secure_url, filename : fileName});
     newImage.save();
    //  console.log(newImage);
  }
  upload(req);
  
});


app.listen(3004, () => console.log("listening on port 3000"));