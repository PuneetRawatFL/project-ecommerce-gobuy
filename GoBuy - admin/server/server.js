const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

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

app.listen(8001, () => {
    console.log("admin server started......");
});
