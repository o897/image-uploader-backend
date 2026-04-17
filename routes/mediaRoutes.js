const express = require('express');
const router = express.Router();


router.get("/youtube/likes", async (req,res) => {
    try {

        const token = req.user.googleAccessToken;
                        console.log("token",req.user);

        const response = await fetch (
            "https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&maxResults=10",
            {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            }
        );

        const data = await response.json();
        console.log("youtube response",data);
        
        res.json(data.items);
    } catch (error) {
        res.status(500).json({error : error.message});
    }
})

module.exports = router