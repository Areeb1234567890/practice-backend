const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: String,
  userEmail: {
    type: String,
  },
  gender: String,
  age: Number,
  password: {
    type: String,
  },
});

const USER = mongoose.model("User", userSchema);
module.exports = USER;
