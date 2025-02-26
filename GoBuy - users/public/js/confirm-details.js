//loading header script
$(function () {
    //announcement bar
    $(".announcement-bar").load("announcement-bar.html");
    //header
    $(".navbar").load("header.html", function () {
        $.getScript("../js/header-script.js");
    });
    //footer
    $("#footer").load("footer.html");
});

// Add this JavaScript code to your script
document.addEventListener("DOMContentLoaded", (event) => {
    document.body.classList.add("fade-transition");
    setTimeout(() => {
        document.body.classList.add("fade-in");
    }, 100); // Adjust the timeout if needed
});

const shoppingList = document.querySelector(".shopping-cart-list");
const subtotalSpan = document.querySelector("#subtotalSpan");
let totalCartPrice = 0;

function savedAddress() {
    fetch(
        `http://localhost:8000/mysql?mysqlQuery=select * from shipping_details order by created_on desc limit 1`
    )
        .then((res) => res.json())
        .then((results) => {
            console.log(results[0]);

            const fullName = document.querySelector("#fullName");
            const mobileno = document.querySelector("#mobileno");
            const fullAddress = document.querySelector("#fullAddress");
            const cityName = document.querySelector("#cityName");
            const stateName = document.querySelector("#stateName");
            const zipCode = document.querySelector("#zipCode");

            fullName.innerText = `${results[0].fname} ${results[0].lname}`;
            mobileno.innerText = results[0].mobileno;
            fullAddress.innerText = results[0].address;
            cityName.innerText = results[0].city;
            stateName.innerText = results[0].state;
            zipCode.innerText = results[0].zipcode;
        });
}
savedAddress();

function refreshShoppingCart() {
    const user = document.cookie.match(/(^| )userId=([^;]+)/);
    const userId = parseInt(user[2], 10);
    fetch(
        `http://localhost:8000/mysql?mysqlQuery=select * from products p join cart c on p.id = c.product_id join users u on u.userId = c.user_id where u.userId=${userId}`
    )
        .then((res) => res.json())
        // .then((json) => {
        .then((products) => {
            // console.log(json);
            shoppingList.innerHTML = "";

            products.forEach((json) => {
                //creating div for each product
                const shoppingCartItem = document.createElement("div");
                shoppingCartItem.classList.add("shoppingCartItem");

                //div for image
                const shoppingItemImage = document.createElement("div");
                shoppingItemImage.classList.add("shoppingItemImage");
                //image tag
                const imagTag = document.createElement("img");
                imagTag.src = `http://localhost:8000/product-images/product_${json.id}-${json.prod_image_id}.jpg`;
                //appending
                shoppingItemImage.append(imagTag);

                //div for details
                const shoppingItemDetails = document.createElement("div");
                shoppingItemDetails.classList.add("shoppingItemDetails");
                //title
                const titleTag = document.createElement("h3");
                titleTag.innerText = json.title;

                //category
                const detailsTag = document.createElement("div");
                detailsTag.classList.add("detailsTag");
                detailsTag.innerHTML = `<p><b>Category:</b> ${json.category}</p>`;

                //quantity
                const quantityTag = document.createElement("p");
                quantityTag.innerText = `Quantity: ${json.product_quantity}`;

                //appending
                shoppingItemDetails.append(titleTag);
                shoppingItemDetails.append(detailsTag);
                shoppingItemDetails.append(quantityTag);

                //div for price
                const shoppingItemPrice = document.createElement("div");
                shoppingItemPrice.classList.add("shoppingItemPrice");
                //price tag
                const priceTag = document.createElement("h4");
                // const itemTotal =
                priceTag.innerText = `$${json.price * json.product_quantity}`;

                //appending
                shoppingItemPrice.append(priceTag);

                //appending to item div
                shoppingCartItem.append(shoppingItemImage);
                shoppingCartItem.append(shoppingItemDetails);
                shoppingCartItem.append(shoppingItemPrice);

                //appending to main list
                shoppingList.append(shoppingCartItem);

                //update total price
                refreshShoppingCartValue();
            });
        });
}
refreshShoppingCart();

function refreshShoppingCartValue() {
    const user = document.cookie.match(/(^| )userId=([^;]+)/);
    const userId = parseInt(user[2], 10);

    fetch(
        `http://localhost:8000/mysql?mysqlQuery=select sum(total_price) as cart_total from cart where cart.user_id =  ${userId}`
    )
        .then((res) => res.json())
        .then((result) => {
            subtotalSpan.innerText = `$${result[0].cart_total}`;
            totalCartPrice = `${result[0].cart_total}`;
        });
}

let confirmPay = document.querySelector("#confirmPay");

confirmPay.addEventListener("click", async () => {
    //adding loading button
    confirmPay.classList.add("addButtonLoadingExtra");
    confirmPay.style.backgroundColor = "#36558f";

    confirmPay.innerText = "";

    const loadingdiv = document.createElement("div");
    loadingdiv.classList.add("addButtonLoading");
    //
    confirmPay.appendChild(loadingdiv);

    // console.log("click");
    const user = document.cookie.match(/(^| )userId=([^;]+)/);
    const userId = parseInt(user[2], 10);

    fetch("http://localhost:8000/create-checkout-session", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ userId: userId, total_amount: totalCartPrice }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe success page
            } else {
                console.error("Checkout session creation failed:", data);
            }
        })
        .catch((err) => console.log("Error:", err));
});
