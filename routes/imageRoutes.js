const express = require("express");
const router = express.Router();

const fileUpload = require("../middleware/multer");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

const imageModel = require("../model/imageModel")

router.get("/test", async (req, res) => {
    res.json({error : "Image not found"});
});

router.get("/api/upload/:filename", (req, res) => {
  const filePath = __dirname + "/public/" + req.params.filename; //
  res.sendFile(filePath);
});

router.get("/api/:image", async (req, res) => {
  const findImage = await imageModel.findOne({ filename : req.params.image });
  const results = findImage
    ? res.json(findImage)
    : res.json({error : "Image not found"});
});

router.post("/upload", fileUpload.single("file"), (req, res) => {
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
     const newImage = new imageModel({url : secure_url, filename : fileName});
     newImage.save();
    //  console.log(newImage);
  }
  upload(req);
  
});

module.exports = router;
