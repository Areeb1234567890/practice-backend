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
  quantityLeft: Number,
});

const PRODUCT = mongoose.model("Product", productSchema);
module.exports = PRODUCT;
