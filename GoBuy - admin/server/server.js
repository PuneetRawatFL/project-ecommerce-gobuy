const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const PORT = process.env.PORT;

//product routes
const productRoutes = require("./routes/productRoutes.js");

app.use(cors());
//middleware to parse json
app.use(express.json());
//
app.use(bodyParser.urlencoded({ extended: true }));
//
app.use(cookieParser());

//db connect
const connection = require("./config/dbConnection.js");

//admin controller
const adminController = require("./controllers/adminController.js");

//user controller
const userController = require("./controllers/userController.js");
// const productController = require("./controllers/productController.js");

//serving product images
app.use(
    "/product-images",
    express.static(
        path.join(__dirname, "../../GoBuy - users/public/product-images")
    )
);

app.use(
    "/uploads",
    express.static(path.join(__dirname, "../../GoBuy - admin/public/uploads"))
);

// product routes
app.use(productRoutes);

//endpoint for sql queries
app.get("/mysql", (req, res) => {
    const mysqlQuery = req.query.mysqlQuery;
    // console.log(mysqlQuery);
    connection.query(mysqlQuery, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        // console.log(results);
        res.status(200).json(results);
    });
});

app.get("/", (req, res) => {
    res.status(200).send("This is admin server");
});

//endpoint for login
app.post("/admin-login", adminController);

//endpoint for user
app.post("/register", userController);

// app.post("/add-product", upload.single("image"), productController);

app.listen(PORT, () => {
    console.log(`admin server started on ${PORT} ......`);
});
