const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const PORT = process.env.PORT;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "C:/ProgramData/MySQL/MySQL Server 8.0/Uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

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
const productController = require("./controllers/productController.js");

//serving product images
app.use(
    "/product-images",
    express.static(
        path.join(__dirname, "../../GoBuy - users/public/product-images")
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

//endpoint to add product

app.get("/get-image/:id", (req, res) => {
    const id = req.params.id;
    const query = `select product_images.product_image, image_status from product_images join products on product_images.product_id = products.id where products.id = ${id}`;

    connection.query(query, (error, results) => {
        if (error) return res.status(400).json({ error: error });

        if (results.length > 0) {
            const images = results.map((row) => {
                return {
                    image_status: row.image_status,
                    product_image: `data:image/jpeg;base64,${row.product_image.toString(
                        "base64"
                    )}`,
                };
            });

            res.json(images);
        }
    });
});

app.post("/add-product", upload.single("image"), productController);

app.get("/upload", (req, res) => {
    const query = `select image_status, product_images.product_image from product_images join products on product_images.product_id = products.id where products.id = 1`;

    connection.query(query, (error, results) => {
        if (error) return res.status(400).json({ error: error });
        console.log(results[0].image_status);

        res.send({
            result: results,
            image_status: results[0].image_status,
            image: `data:image/jpeg;base64,${results[0].product_image.toString(
                "base64"
            )}`,
        });
        // if (results.length > 0) {
        //     console.log("status", results[1].image_status);
        //     const images = results.map((row) => {
        //         // console.log(row.image_status);
        //         return `data:image/jpeg;base64,${row.product_image.toString(
        //             "base64"
        //         )}`;
        //     });

        //     res.json(images);
        // }
    });
});

app.get("/products", (req, res) => {
    const query = "SELECT * FROM products";
    connection.query(query, (error, results) => {
        if (error) return res.status(500).json({ error: error.message });

        // Encode image data to base64
        results.forEach((product) => {
            if (product.product_image) {
                product.product_image =
                    product.product_image.toString("base64");
            }
        });

        res.json(results);
    });
});

//  update products SET product_image = LOAD_FILE('C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\product_8-2.jpg') where id = 1;

app.listen(PORT, () => {
    console.log(`admin server started on ${PORT} ......`);
});
