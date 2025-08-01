const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const brandSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
brandSchema.plugin(paginate);

const Brands = mongoose.model("brands", brandSchema);

module.exports = Brands;
