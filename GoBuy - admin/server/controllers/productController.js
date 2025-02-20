const connection = require("../config/dbConnection.js");

const productController = (req, res) => {
    // console.log(req.body);
    const { title, description, category, rating, count, price } = req.body;
    const file = req.file.filename;
    console.log(req.file.filename);

    const query = `
    insert into products(title, price, description, category, rating_rate, rating_count, product_image) values(?,?,?,?,?,?, '${req.file.filename}');
    
    SET @product_id = LAST_INSERT_ID();

    insert into product_images(product_id, product_image) values(@product_id, '${req.file.filename}');
    `;
    const values = [title, price, description, category, rating, count];

    connection.query(query, values, (error, results) => {
        if (error) return res.status(400).json({ error: error });
        res.status(200).json({ message: "success" });
    });

    // res.send(req.body);
};

module.exports = productController;
