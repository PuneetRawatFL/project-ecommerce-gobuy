const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 8000;
//importing schema
const Product = require("./Models/productSchema.js");

//middleware to parse json
app.use(express.json());

//crating connection mongoose database
mongoose
    .connect("mongodb://localhost:27017/gobuy")
    .then(() => {
        console.log("database connected");
    })
    .catch((err) => {
        console.error("Error connecting to database: ", err);
    });

//fetch products

//home page route
app.get("/home", (req, res) => {
    res.send("Home page for gobuy");
});

// fetch all products
app.get("/products", async (req, res) => {
    //fetch aescending or descending
    const sort = req.query.sort;
    if (sort === "desc") {
        sortFilter = -1;
    } else {
        sortFilter = 1;
    }
    const products = await Product.find().sort({ id: sortFilter });
    res.status(200).json(products);

    // try {
    //     const products = await Product.find();
    //     res.json(products);
    // } catch (err) {
    //     res.status(500).send(err);
    // }
});

//fetch products using id
app.get("/products/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findOne({ id: productId });
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).send("Product not found");
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

//fetch products in category
app.get("/products/category/:category", async (req, res) => {
    //extracting category from params
    const productCategory = req.params.category;

    //electronics category
    if (productCategory === "electronics") {
        const products = await Product.find({ category: productCategory });
        res.status(200).json(products);
    }
    //jewelery category
    if (productCategory === "jewelery") {
        const products = await Product.find({ category: productCategory });
        res.status(200).json(products);
    }
    //mens category
    if (productCategory === "men's clothing") {
        const products = await Product.find({ category: productCategory });
        res.status(200).json(products);
    }
    //womens category
    if (productCategory === "women's clothing") {
        const products = await Product.find({ category: productCategory });
        res.status(200).json(products);
    }
});

app.listen(PORT, () => {
    console.log("server started");
});
