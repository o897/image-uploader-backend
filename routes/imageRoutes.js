const express = require("express");
const router = express.Router();

const fileUpload = require("../middleware/multer");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

const imageModel = require("../model/imageModel");

router.get("/test", async (req, res) => {
  res.json({ error: "Image not found" });
});

router.get("/api/upload/:filename", (req, res) => {
  const filePath = __dirname + "/public/" + req.params.filename; //
  res.sendFile(filePath);
});

router.get("/api/:image", async (req, res) => {
  const findImage = await imageModel.findOne({ filename: req.params.image });
  const results = findImage
    ? res.json(findImage)
    : res.json({ error: "Image not found" });
});

router.post("/upload", fileUpload.single("file"), async (req, res) => {
  try {
    // check to see the request has a file attached to it.
    if (!req.file) return res.status(400).json({ error: "No file" });

    const fileName = req.file.originalname;

    const streamUpload = (req) => {
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
    // const timeString = currentTime.toLocaleTimeString();
    
    // the results of how our upload went, and if its ready
    let result = await streamUpload(req);

    let { secure_url } = result;
    const newImage = new imageModel({ url: secure_url, filename: fileName });
    await newImage.save();

    return res.status(200).json({
      success: true,
      message: "Image uploaded and saved to cloudinary",
      data: newImage,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
