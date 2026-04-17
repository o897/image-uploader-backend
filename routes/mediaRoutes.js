const express = require("express");
const router = express.Router();

router.get("/youtube/likes", async (req, res) => {
  try {
    if (!req.user || !req.user.googleAccessToken) {
      return res.status(401).json({
        error: "Not authenticated or missing Google token",
      });
    }

    const token = req.user.googleAccessToken;

    console.log("token in youtube/likes:", token);

    const url =
      "https://www.googleapis.com/youtube/v3/playlistItems" +
      "?part=snippet&maxResults=10&playlistId=LL";

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("YouTube API error:", data);
      return res.status(response.status).json(data);
    }

    console.log("youtube response OK");

    return res.json(data.items || []);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;