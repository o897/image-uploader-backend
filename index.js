const express = require('express')
const multer = require('multer')
const cors = require('cors')
const app = express()
const upload = multer({dest : 'uploads/'})

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.get('/', (req,res) => res.send('Hello World.'))
 
app.post('/upload',upload.single('file'),(req,res) => {

    const file = req.file;

    if(!file) {
        return res.status(400).json({error : 'No file uploaded'})
    }

    const filePath = path.join(__dirname, file.path)

    res.json({message : 'Image uploaded successfully' , filePath})
})

app.listen(3003, () => console.log('listening on port 3000'))