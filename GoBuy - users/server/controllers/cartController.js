const connection = require("../config/dbConnection.js");

exports.getCart = (req, res) => {
    connection.query("select * from temp_table", (error, results) => {
        if (error) {
            return res.status(500).json({ error: error });
        }
        res.status(200).json(results);
    });
};

exports.addToCart = (req, res) => {
    // console.log(req.body);
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
};
