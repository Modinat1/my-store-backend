const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const orderSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: [true, "ownerId is required"],
    },
    orders: [
      {
        productName: {
          type: String,
          required: [true, "Product name is required"],
          trim: true,
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: [true, "Product ID is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity cannot be less than 1"],
        },
        totalCost: {
          type: Number,
          required: [true, "Total cost is required"],
        },
        shippingStatus: {
          type: String,
          enum: ["pending", "shipped", "delivered", "cancelled"],
          default: "pending",
        },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

orderSchema.plugin(paginate);

const Orders = mongoose.model("orders", orderSchema);

module.exports = Orders;
