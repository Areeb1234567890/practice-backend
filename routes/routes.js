const express = require("express");
const router = express.Router();
const {
  registerUser,
  addProduct,
  getOrders,
  orderProduct,
} = require("../controller/Controller");
const tryCatch = require("../middleware/tryCatch");

router.post("/register", tryCatch(registerUser));
router.post("/addProduct", tryCatch(addProduct));
router.get("/getOrder", tryCatch(getOrders));
router.post("/orderProduct/:userId", tryCatch(orderProduct));

module.exports = router;
