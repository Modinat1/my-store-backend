const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: [true, "ownerId is required"],
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    productImages: [String],
    cost: {
      type: Number,
      required: [true, "Cost is required"],
      min: [0, "Cost must be a positive number"],
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: "Cost must be a positive number",
      },
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    stockStatus: {
      type: String,
      enum: ["in-stock", "out-of-stock", "low-stock"],
      default: "in stock",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("products", productSchema);

module.exports = Product;
