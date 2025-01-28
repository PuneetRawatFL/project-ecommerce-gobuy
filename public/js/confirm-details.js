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

const shoppingList = document.querySelector(".shopping-cart-list");
const subtotalSpan = document.querySelector("#subtotalSpan");
let totalCartPrice = 0;

function savedAddress() {
    fetch(
        `http://localhost:8000/mysql?mysqlQuery=select * from shipping_details limit 1`
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

            fullName.innerText = `${results[0].fname}+${results[0].lname}`;
            mobileno.innerText = results[0].mobileno;
            fullAddress.innerText = results[0].address;
            cityName.innerText = results[0].city;
            stateName.innerText = results[0].state;
            zipCode.innerText = results[0].zipcode;
        });
}
savedAddress();

function refreshShoppingCart() {
    fetch(
        `http://localhost:8000/mysql?mysqlQuery=select * from products p join temp_table t where p.id = t.product_id`
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
                imagTag.src = `http://localhost:8000/product-images/product_${json.id}.jpg`;
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
    let totalPrice = 0;

    fetch(
        "http://localhost:8000/mysql?mysqlQuery=select * from products p join temp_table t where p.id = t.product_id"
    )
        .then((res) => res.json())
        .then((result) => {
            // console.log(result);
            result.forEach((item) => {
                totalPrice += item.price * item.product_quantity;
                totalPrice = parseFloat(totalPrice.toFixed(2));
                // cartTotal.innerText = totalPrice;
                subtotalSpan.innerText = `$${totalPrice}`;
            });
        });
}
