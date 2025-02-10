// https://api.stripe.com - base url

const stripe = require("stripe")(
    "sk_test_51QmUdmD8RxU8tzk9yCaG6hZgEao5PWF0QSgcXyEYfHdF9T1a0WSpRFmVjPBItdKQkGKnE1KRUEhZb9UmhxQUMbUG00lpluIJy2"
);

(async () => {
    //for all customers
    const customers = await stripe.customers.list();
    //for particular customer
    const cust1 = await stripe.customers.retrieve("cus_Rk5bl7YKpwv1d3");
    console.log(customers);
    console.log(cust1);
})();
