const express = require('express');
const router = express.Router();


router.get("/youtube/likes", async (req, res) => {
  try {
    console.log("likes",req.user.googleAccessToken);
    
    res.json({token : req.user.googleAccessToken})

    const token = req.user.googleAccessToken;
    console.log("token in youtube/likes",token);
    
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=LL",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log("youtube response", data);

    res.json(data.items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router