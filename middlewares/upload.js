// middleware/upload.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Folder where the uploaded image will be stored
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        // Use the current timestamp and original file name for uniqueness
        const fileExtension = path.extname(file.originalname); // Extract file extension
        cb(null, `${Date.now()}${fileExtension}`); // Generate a unique file name
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({ storage }).single("image");

module.exports = upload;
