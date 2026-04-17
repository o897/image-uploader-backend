const express = require('express')
const router = express.Router();
const authRoutes = require('../routes/authRoutes')
const imageRoutes = require('../routes/imageRoutes')
const mediaRoutes = require('../routes/mediaRoutes')

router.use('/image',imageRoutes)
router.use('/auth',authRoutes)
router.use('/media',mediaRoutes)

router.get('/', (req,res) => {
   res.send("Image uploader Server running")
})

module.exports = router