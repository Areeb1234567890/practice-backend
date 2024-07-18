const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  Customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  Products: [
    {
      productDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
    },
  ],
});

const ORDER = mongoose.model("product", OrderSchema);
module.exports = ORDER;
