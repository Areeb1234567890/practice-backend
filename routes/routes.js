const express = require("express");
const router = express.Router();
const {
  registerUser,
  addProduct,
  getProduct,
} = require("../controller/testController");
const tryCatch = require("../middleware/tryCatch");

router.post("/register", tryCatch(registerUser));
router.post("/addProduct", tryCatch(addProduct));
router.get("/getProduct/:productId", tryCatch(getProduct));

module.exports = router;
