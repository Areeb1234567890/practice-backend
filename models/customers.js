const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: String,
  userEmail: {
    type: String,
  },
  password: {
    type: String,
  },
});

const USER = mongoose.model("Customer", userSchema);
module.exports = USER;
