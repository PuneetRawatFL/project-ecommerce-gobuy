const connection = require("../config/dbConnection.js");

exports.addNewProduct = (req, res) => {
    // console.log(req.body);
    const { title, description, category, rating, count, price } = req.body;
    // console.log(req.files[0].filename);
    // console.log(req.files[1].filename);

    const query = `
    insert into products(title, price, description, category, rating_rate, rating_count, product_image) values(?,?,?,?,?,?, '${req.files[0].filename}');

    SET @product_id = LAST_INSERT_ID();

    insert into product_images(product_id, product_image) values(@product_id, '${req.files[0].filename}');
    insert into product_images(product_id, product_image) values(@product_id, '${req.files[1].filename}');
    `;
    const values = [title, price, description, category, rating, count];

    connection.query(query, values, (error, results) => {
        if (error) return res.status(400).json({ error: error });
        res.status(200).json({ message: "success" });
    });

    // res.send(req.body);
};

exports.getAllProducts = (req, res) => {
    const query = "SELECT * FROM products";
    connection.query(query, (error, results) => {
        if (error) return res.status(500).json({ error: error.message });

        res.json(results);
    });
};

exports.getProductById = (req, res) => {
    const id = req.params.id;
    const query = `select * from products where id = ${id}`;
    connection.query(query, (error, results) => {
        if (error) return res.status(400).json({ error: error });

        return res.status(200).json(results);
    });
};

exports.deleteProduct = (req, res) => {
    const id = req.params.id;
    const query = `
        delete from products where id = ${id};
        delete from product_images where product_id = ${id};
    `;

    connection.query(query, (error, results) => {
        if (error) return res.status(400).json({ error: error });

        res.json({ message: "success" });
    });
};

exports.editProduct = (req, res) => {
    const id = req.params.id;
    let optionalQuery1 = "";
    let optionalQuery2 = "";
    let optionalQuery3 = "";

    if (req.files.image1) {
        console.log("first image");
        optionalQuery1 = `update product_images set product_image = '${req.files.image1[0].filename}' where product_id = ${id} order by image_id limit 1`;
        optionalQuery2 = `update products set product_image = '${req.files.image1[0].filename}' where id = ${id}`;
    }
    if (req.files.image2) {
        console.log("second image");
        optionalQuery1 = `update product_images set product_image = '${req.files.image2[0].filename}' where product_id = ${id} order by image_id desc limit 1`;
    }

    if (req.files.image1 && req.files.image2) {
        console.log("Two image uploaded");
        optionalQuery1 = `update product_images set product_image = '${req.files.image1[0].filename}' where product_id = ${id} order by image_id limit 1`;
        optionalQuery2 = `update products set product_image = '${req.files.image1[0].filename}' where id = ${id}`;
        optionalQuery3 = `update product_images set product_image = '${req.files.image2[0].filename}' where product_id = ${id} order by image_id desc limit 1`;
    }

    const {
        title,
        description,
        category,
        rating_rate,
        rating_count,
        price,
        sku,
    } = req.body;

    const query = `
    update products set title = ?, price = ? , description = ?, category = ?, rating_rate = ?, rating_count = ?, sku = ? where id = ${id};
    ${optionalQuery1};
    ${optionalQuery2};
    ${optionalQuery3};
    `;
    const values = [
        title,
        price,
        description,
        category,
        rating_rate,
        rating_count,
        sku,
    ];

    // console.log(query);

    connection.query(query, values, (error, results) => {
        if (error) return res.status(400).json({ error: error });
        res.status(200).json("success");
    });
};
