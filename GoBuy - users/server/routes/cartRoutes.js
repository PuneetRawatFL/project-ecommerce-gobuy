const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController.js");

router.get("/cart", cartController.getCart);
router.post("/addToCart", cartController.addToCart);

module.exports = router;
