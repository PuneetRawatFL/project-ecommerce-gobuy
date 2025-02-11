const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController.js");

router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.get(
    "/products/category/:category",
    productController.getProductByCategory
);

module.exports = router;
