const express = require('express')
const router = express.Router();
const authRoutes = require('../routes/authRoutes')
const imageRoutes = require('../routes/imageRoutes')

router.use('/image',imageRoutes)
router.use('/auth',authRoutes)


router.get('/', (req,res) => {
   res.send("Image uploader Server running")
})

module.exports = router