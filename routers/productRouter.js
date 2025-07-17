const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");
const uploadImages = require("../middleware/uploadImages");

// Product Router
router.get(
  "/",
  verifyToken,
  verifyRole(["admin", "customer"]),
  productController.getAllProduct
);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin"]),
  uploadImages.array("productImages", 5),
  productController.addNewProduct
);
router.get(
  "/:id",
  verifyToken,
  verifyRole(["admin", "customer"]),
  productController.getProductById
);
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin", "customer"]),
  productController.updateProduct
);
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin", "customer"]),
  productController.updateProductStatus
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  productController.deleteProduct
);

module.exports = router;
