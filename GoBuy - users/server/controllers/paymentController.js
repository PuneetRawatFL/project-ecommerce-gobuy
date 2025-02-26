const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const YOUR_DOMAIN = "http://127.0.0.1:5500/GoBuy%20-%20users/public/html/";

const connection = require("../config/dbConnection.js");

const paymentController = async (req, res) => {
    // converting amount to cents
    const total_amount = req.body.total_amount * 100;

    //creating stripe session for payment
    try {
        const session = await stripe.checkout.sessions.create({
            customer_email: "customer@example.com",
            submit_type: "pay",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Order Total",
                        },
                        unit_amount: `${total_amount}`, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${YOUR_DOMAIN}/success.html`,
            cancel_url: `${YOUR_DOMAIN}/cancel.html`,
            client_reference_id: `${req.body.userId}`,
        });
        console.log("Session created");
        // console.log(session);

        const query = `
            INSERT INTO orders(user_id, order_date, total_amount)
            SELECT user_id, NOW(), SUM(product_quantity * product_price) AS total_amount
            FROM cart
            WHERE user_id = ${req.body.userId};

            SET @order_id = LAST_INSERT_ID();

            INSERT INTO order_items(order_id, product_id, quantity, price)
            SELECT @order_id, product_id, product_quantity, product_price
            FROM cart   
            WHERE user_id = ${req.body.userId};

            DELETE FROM cart WHERE user_id = ${req.body.userId};

            UPDATE orders SET delivery_address = (
            SELECT CONCAT(fname, ', ', lname, ', ', email, ', ', mobileno, ', ', address, ', ', landmark, ', ', state, ', ', city, ', ', zipcode) AS delivery_address FROM shipping_details ORDER BY created_on desc limit 1) where order_id = @order_id;

            delete from shipping_details;

            `;
        console.log(query);

        connection.query(query, (error, results) => {
            if (error) {
                // return res.status(500).json({ error: error.sqlMessage });
            }
        });
        // console.log("redirecting");
        res.json({ url: session.url, session_id: session.id });
    } catch (error) {
        // console.error("Error executing query:", error);
        return res.status(500).json(`Error executing query: ${error.message}`);
    }
};

module.exports = paymentController;
