const multer = require("multer");
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') // Specify the destination folder for storing the files
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + path.extname(file.originalname)
        cb(null, fileName) // Set the file name as per  requirement
    }
})

// Multer upload middleware using the defined storage configuration
const upload = multer({storage}) 

module.exports = upload