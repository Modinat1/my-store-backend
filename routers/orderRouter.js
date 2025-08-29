const express = require("express");

const router = express.Router();

const orderController = require("../controllers/orderController.js");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

router.get("/", verifyToken, orderController.getAllOrder);
router.post(
  "/",
  verifyToken,
  verifyRole(["customer"]),
  orderController.createOrder
);
router.get("/history", verifyToken, orderController.orderHistory);
router.get("/:id", verifyToken, orderController.getOrderById);
router.patch("/:id", verifyToken, orderController.updateOrderById);
router.patch(
  "/status/:id",
  verifyToken,
  verifyRole(["admin"]),
  orderController.updateShippingStatus
);
router.delete("/:id", verifyToken, orderController.deleteOrderById);

module.exports = router;
