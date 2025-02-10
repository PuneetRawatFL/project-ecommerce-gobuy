const stripe = require("stripe")(
    "sk_test_51QmUdmD8RxU8tzk9yCaG6hZgEao5PWF0QSgcXyEYfHdF9T1a0WSpRFmVjPBItdKQkGKnE1KRUEhZb9UmhxQUMbUG00lpluIJy2"
);

(async () => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 2000,
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    console.log(paymentIntent.id);
    console.log(paymentIntent.status);
})();
