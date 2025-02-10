// This is your test secret API key.
const stripe = require("stripe")(
    "sk_test_51QmUdmD8RxU8tzk9yCaG6hZgEao5PWF0QSgcXyEYfHdF9T1a0WSpRFmVjPBItdKQkGKnE1KRUEhZb9UmhxQUMbUG00lpluIJy2"
);
const express = require("express");
const app = express();
app.use(express.static("public"));

const YOUR_DOMAIN = "http://127.0.0.1:5500/GoBuy%20-%20users/server/stripe/";

app.post("/create-checkout-session", async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        customer_email: "customer@example.com",
        submit_type: "pay",
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                // price: "price_1QmaSJD8RxU8tzk9Ugj9vRWg",
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Order Total",
                    },
                    unit_amount: 2000, // Amount in cents (e.g., $20.00)
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${YOUR_DOMAIN}/success.html`,
        cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    console.log(session);

    res.redirect(303, session.url);
});

app.get("/checkout-session-status", async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(
        req.query.session_id
    );
    res.json({ payment_status: session.payment_status });
});

app.listen(4242, () => console.log("Running on port 4242"));
