require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const fileUpload = require("./middleware/multer");
const cloudinary = require("./utils/cloudinary");
const streamifier = require("streamifier");
app.use(cors());

app.use(express.static("public"));

// Set middleware of CORS 
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://your-frontend.com"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

const mongoose = require("./config/mongoose");
const Schema = mongoose.Schema;

// Define our Schema
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

// // Collection name
const ImageModel = mongoose.model("image", ImageSchema);

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
    : res.send("Image not found.");
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

  async function upload(req) {
    let result = await streamUpload(req);
    console.log("result : ", result);
    
    let {secure_url} = result;

     // mongoose
     const newImage = new ImageModel({url : secure_url, filename : fileName});
     newImage.save();

     console.log(newImage);
  }

  upload(req);
});


app.listen(3004, () => console.log("listening on port 3000"));
