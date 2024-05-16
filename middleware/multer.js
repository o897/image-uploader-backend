const multer = require('multer')

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'public');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

// const upload = multer({storage})
const fileUpload = multer()

module.exports = fileUpload