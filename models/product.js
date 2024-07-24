const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    productName: String,
    productCategory: {
      type: String,
    },
    productPrie: {
      type: Number,
    },
    quantitySold: { type: Number, default: 0 },
    totalQuantity: Number,
    outOfStock: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PRODUCT = mongoose.model("Product", productSchema);
module.exports = PRODUCT;
