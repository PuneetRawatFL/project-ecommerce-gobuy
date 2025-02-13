const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const PORT = process.env.PORT;

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

//serving product images
app.use(
    "/product-images",
    express.static(
        path.join(
            __dirname,
            "../../GoBuy - users/public/                                                                                                                                                                                 "
        )
    )
);

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

const directoryPath =
    "D:\\Project\\GoBuy\\GoBuy - users\\public\\product-images";
//endpoint to change image
app.post("/change-image", (req, res) => {
    const fileName = req.body.fileName;
    console.log(fileName);
    //checking if file exists
    const filePath = path.join(directoryPath, fileName);
    if (fs.existsSync(filePath)) {
        res.status(200).send("File exists");
    } else {
        res.status(400).send("No such file exists");
    }
});

app.listen(PORT, () => {
    console.log(`admin server started on ${PORT} ......`);
});
