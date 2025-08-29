const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController.js");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, userController.getUserProfile);

module.exports = router;
