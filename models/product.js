const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productName: String,
  productCategory: {
    type: String,
  },
  productPrie: {
    type: Number,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
});

const PRODUCT = mongoose.model("product", productSchema);
module.exports = PRODUCT;
