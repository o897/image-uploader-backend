// update image

const User = require("../model/userModel");
const Image = require("../model/image");
// delete an image

const removeImage = (id, userId) => {
  const image = findByIdAndDelete({ _id: imageId, owner: userId });

  if (!image) {
    return res.status(404).json({ error: "ïmage not found" });
  }

  res.status(200).json({
    success: true,
    message: `Image deleted successfully`,
    deletedImage: image,
  });
};

// like image

const likeImage = (id, userId) => {
  // user clicks on a button to like the image, after clicking count increases
  // This image that is liked increase likes
  const image = Image.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );

  if (!image) {
    console.log("image not found");
  }

  res.json({
    success: true,
    likes: image.likes,
  });
};
