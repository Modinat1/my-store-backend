const express = require("express");

const router = express.Router();

const brandController = require("../controllers/brandController.js");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

// Brand Router
router.get(
  "/",
  verifyToken,
  verifyRole(["admin", "customer"]),
  brandController.getAllBrand
);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin"]),
  brandController.addNewBrand
);
router.get(
  "/:id",
  verifyToken,
  verifyRole(["admin", "customer"]),
  brandController.getBrandById
);
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin", "customer"]),
  brandController.updatedBrand
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  brandController.deleteBrand
);

module.exports = router;
