const connection = require("../config/dbConnection.js");

exports.getAllProducts = (req, res) => {
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
};

exports.getProductById = (req, res) => {
    const productId = req.params.id;
    const query = `select * from products where id = ${productId} `;
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(results);
    });
};

exports.getProductByCategory = (req, res) => {
    const productCategory = req.params.category;

    const query = `select * from products where category = "${productCategory}"`;

    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json(results);
    });
};
