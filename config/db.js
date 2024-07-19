const mongoose = require("mongoose");

const connectToDb = (url) => {
  mongoose
    .connect(url)
    .then(() => {
      console.log("Database connected sucessfully");
    })
    .catch((err) => console.log(err));
};

module.exports = {connectToDb}