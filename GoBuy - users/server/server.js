const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

//controller for sending mail
const sendMail = require("./controllers/sendMail.js");
//controller for user
const userController = require("./controllers/userController.js");

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

//creating connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "gobuy",
    multipleStatements: true,
});

//connecting
connection.connect((err) => {
    if (err) {
        return console.error("Error connecting to database: ", err);
    }

    console.log("database connected");
});

//query to fetch all produccts
app.get("/products", (req, res) => {
    const sort = req.query.sort;

    let query;
    //for products
    if (sort === "asc") {
        query = `select * from products order by id ${sort}`;
    } else if (sort === "desc") {
        query = `select * from products order by id ${sort}`;
    }
    //for price
    else if (sort === "price_asc") {
        query = `select * from products order by price`;
    } else if (sort === "price_desc") {
        query = `select * from products order by price desc`;
    } else {
        query = "select * from products";
    }
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(results);
    });
});

//query to fetch using id
app.get("/products/:id", (req, res) => {
    const productId = req.params.id;
    const query = `select * from products where id = ${productId} `;
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(results);
    });
});

//query to fetch using categories
app.get("/products/category/:category", (req, res) => {
    const productCategory = req.params.category;

    const query = `select * from products where category = "${productCategory}"`;

    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json(results);
    });
});

//route to see cart items
app.get("/cart", (req, res) => {
    connection.query("select * from temp_table", (error, results) => {
        if (error) {
            return res.status(500).json({ error: error });
        }
        res.status(200).json(results);
    });
});

//post route to add item to cart
app.post("/addToCart", (req, res) => {
    console.log(req.body);
    const itemReceived = req.body.data;
    const userId = req.body.userId;
    // res.json({ message: "Data received successfully!", data: itemReceived });

    const query =
        "insert into cart(product_id, product_price, product_quantity, user_id) values (?,?,?,?)";
    const values = [itemReceived.id, itemReceived.price, "1", userId];

    connection.query(query, values, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(results);
    });
});

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
app.post("/submit-shipping-details", (req, res) => {
    const formData = req.body;

    const query = "insert into shipping_details values (?,?,?,?,?,?,?,?,?)";
    const values = [
        formData.fname,
        formData.lname,
        formData.email,
        formData.mobileno,
        formData.addressLine1,
        formData.landmark,
        formData.state,
        formData.city,
        formData.city,
    ];

    connection.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json(results);
    });
});

//api endpoint to send customer support email
app.post("/sendemail", sendMail);

//endpoint for user
app.post("/register", userController);

//endpoint to place order
app.post("/place-order", (req, res) => {
    console.log(req.body.userId);

    const query = `
    insert into orders(user_id, order_date, total_amount) select user_id, now(), sum(product_quantity * product_price) as total_amount from cart where user_id = ${req.body.userId};
    insert into order_items(order_id, product_id, quantity, price) select o.order_id, c.product_id, c.product_quantity, c.product_price from cart c join orders o on o.user_id = c.user_id where c.user_id = ${req.body.userId};
    delete from cart where user_id = ${req.body.userId};
    `;
    // console.log(query);

    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error });
        }
        console.log("response okay");
        res.status(200).json(results);
    });

    // res.status(200).send("accept");
});

//starting server
app.listen(8000, () => {
    console.log("server started");
});
