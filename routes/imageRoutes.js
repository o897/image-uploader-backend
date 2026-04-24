const express = require("express");
const router = express.Router();

const fileUpload = require("../middleware/multer");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

const imageModel = require("../model/imageModel");

router.get("/test", async (req, res) => {
  console.log(req.user);
  res.json({ error: "Image not found" });
});

router.get("/api/upload/:filename", (req, res) => {
  const filePath = __dirname + "/public/" + req.params.filename; //
  res.sendFile(filePath);
});

router.get("/all", async (req,res) => {
  const allImages = await imageModel.find();
  const results = allImages ? res.json(allImages) : res.json({message : "Not found"})
})

// fetches one image
router.get("/api/:image", async (req, res) => {
    const filename = decodeURIComponent(req.params.image).trim();

  const findImage = await imageModel.findOne({ filename:  { $regex: `^${filename}$`, $options: "i" }});
  const results = findImage
    ? res.json(findImage)
    : res.json({ error: "Image not found" });
});

// fetches users images
router.get("/mine", async (req, res) => {

  try {
    
    const images = await imageModel.find({owner : req.user._id});

    if (images.length === 0) {
      return res.status(404).json({message : "No images found"})
    }
    const results = images;
    return res.json(results)
     
  } catch (error) {
      console.log(error);
  }

})

router.post("/upload/:category?", fileUpload.single("file"), async (req, res) => {
  // console.log(`user`, req.user._id)
  try {
    // check to see the request has a file attached to it.
    if (!req.file) return res.status(400).json({ error: "No file" });

    const fileName = req.file.originalname;
    const categoryName = req.params.category;

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


    // the results of how our upload went, and if its ready
    let result = await streamUpload(req);
    
    let { secure_url } = result;
    const newImage = new imageModel({ url: secure_url, filename: fileName, owner : req.user._id });
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
