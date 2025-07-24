const multer = require("multer");

const storage = multer.memoryStorage();

// const uploadImages = multer({ storage });

const uploadImages = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = uploadImages;
