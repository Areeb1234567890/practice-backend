const express = require("express");
const router = express.Router();
const {
  registerUser,
  addProduct,
  getOrders,
  orderProduct,
  getProduct,
} = require("../controller/Controller");
const tryCatch = require("../middleware/tryCatch");

router.post("/register", tryCatch(registerUser));
router.post("/addProduct", tryCatch(addProduct));
router.get("/getOrder", tryCatch(getOrders));
router.get("/getProduct", tryCatch(getProduct));
router.post("/orderProduct/:userId", tryCatch(orderProduct));

module.exports = router;
