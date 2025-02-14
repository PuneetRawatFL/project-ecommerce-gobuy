const connection = require("../config/dbConnection.js");

const shippingController = (req, res) => {
    const formData = req.body;

    const query = "insert into shipping_details values (?,?,?,?,?,?,?,?,?,?)";
    const values = [
        new Date(),
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
};

module.exports = shippingController;
