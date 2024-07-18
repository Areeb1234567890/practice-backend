const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productName: String,
  productCategory: {
    type: String,
  },
  productPrie: {
    type: Number,
  },
  quantitySold: Number,
  totalQuantity: Number,
  outOfStock: {
    type: Boolean,
    default: false,
  },
});

const PRODUCT = mongoose.model("Product", productSchema);
module.exports = PRODUCT;
