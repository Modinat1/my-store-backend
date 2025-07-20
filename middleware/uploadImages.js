const multer = require("multer");

const storage = multer.memoryStorage();

const uploadImages = multer({ storage });

module.exports = uploadImages;
