const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const PORT = process.env.PORT;

//connect to db
const connection = require("./config/dbConnection.js");
//controller for sending mail
const sendMail = require("./controllers/sendMail.js");
//controller for user
const userController = require("./controllers/userController.js");
//controller for payment
const paymentController = require("./controllers/paymentController.js");
//shipping controller
const shippingController = require("./controllers/shippingController.js");

//product routes
const productRoutes = require("./routes/productRoutes.js");
//cart routes
const cartRoutes = require("./routes/cartRoutes.js");

//cors
app.use(cors());
//middleware to parse json
app.use(express.json());
//
app.use(bodyParser.urlencoded({ extended: true }));
//
app.use(cookieParser());

//to use static images for product items
app.use(
    "/product-images",
    express.static(path.join(__dirname, "../public/product-images"))
);

//using product routes
app.use(productRoutes);

//using cart routes
app.use(cartRoutes);

//end point for sql query
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

//end point for saving shipping details
app.post("/submit-shipping-details", shippingController);

//api endpoint to send customer support email
app.post("/sendemail", sendMail);

//endpoint for user
app.post("/register", userController);

//endpoint to place order
app.post("/create-checkout-session", paymentController);

//edit user
app.post("/edit-user", (req, res) => {
    const { name, email, gender, userId } = req.body;
    console.log(userId);

    const query = `update users set name = ?, email = ?, gender = ? where userId = ?`;
    const values = [name, email, gender, userId];

    connection.query(query, values, (error, results) => {
        if (error)
            return res.status(500).json({ message: "error editing user" });
        return res.status(200).json({ message: "success" });
    });
});

//starting server
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});
