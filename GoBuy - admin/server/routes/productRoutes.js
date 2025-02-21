const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const productController = require("../controllers/productController.js");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "D:\\Project\\GoBuy\\GoBuy - admin\\public\\uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.post(
    "/add-product",
    upload.array("image", 2),
    productController.addNewProduct
);

router.get("/products", productController.getAllProducts);

router.get("/get-product/:id", productController.getProductById);

router.get("/delete-product/:id", productController.deleteProduct);

router.post(
    "/edit-product/:id",
    upload.fields([{ name: "image1" }, { name: "image2" }]),
    productController.editProduct
);

module.exports = router;
