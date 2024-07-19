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
      _id: false,
    },
  ],
});

const ORDER = mongoose.model("orders", OrderSchema);
module.exports = ORDER;
