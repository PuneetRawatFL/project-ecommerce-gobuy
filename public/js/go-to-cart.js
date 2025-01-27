// fetching header, footer and announcement bar

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

setTimeout(() => {
    // console.log("HEllo");
    //disable cart modal
    document.querySelector(".shopping-cart").style.pointerEvents = "none";
    document.querySelector(".shopping-cart").style.cursor = "default";
}, 1000);

const shoppingList = document.querySelector(".shopping-cart-list");
const subtotalSpan = document.querySelector("#subtotalSpan");
let totalCartPrice = 0;

//trial product

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
                const detailsTag = document.createElement("p");
                detailsTag.classList.add("detailsTag");
                detailsTag.innerText = json.description;

                //category
                //quantity
                //creating quantity counter div
                const itemQuantityDiv = document.createElement("div");
                itemQuantityDiv.classList.add("item-quantity");
                itemQuantityDiv.classList.add("item");
                itemQuantityDiv.style.backgroundColor = "#ffffff";
                itemQuantityDiv.style.marginTop = "10px";
                itemQuantityDiv.style.justifyContent = "start";

                //creating quantity counter container
                const itemQuantityContainer = document.createElement("div");
                itemQuantityContainer.classList.add("item-quantity-container");
                itemQuantityContainer.style.justifyContent = "start";

                //creating buttons and div for item count
                //increase btn
                const itemIncrease = document.createElement("button");
                itemIncrease.classList.add("counter");
                itemIncrease.id = "itemIncrease";
                itemIncrease.innerText = "+";

                itemIncrease.addEventListener("click", () => {
                    fetch(
                        `http://localhost:8000/mysql?mysqlQuery=update temp_table set product_quantity = product_quantity %2B 1 where product_id = ${json.id}`
                    )
                        .then((res) => res.json())
                        .then((result) => {
                            console.log(result);
                            //to increase cart item number
                            window.updateCartItem();

                            //window
                            window.refreshCart();

                            //shopping cart
                            refreshShoppingCart();
                        });
                });

                //count div
                const itemCount = document.createElement("div");
                itemCount.id = "itemCount";
                //p tag for count
                const pItemCount = document.createElement("p");
                // pItemCount.innerText = json.quantity;  --older
                pItemCount.innerText = json.product_quantity;
                pItemCount.id = `itemQuantity-${json.id}`;
                //appending
                itemCount.append(pItemCount);

                //decrease btn
                const itemDecrease = document.createElement("button");
                itemDecrease.classList.add("counter");
                itemDecrease.id = "itemDecrease";
                itemDecrease.innerText = "-";

                itemDecrease.addEventListener("click", () => {
                    // console.log(json.product_quantity - 1);
                    if (json.product_quantity - 1 == 0) {
                        fetch(
                            `http://localhost:8000/mysql?mysqlQuery=delete from temp_table where product_id = ${json.id}`
                        )
                            .then((res) => res.json())
                            .then((result) => {
                                console.log("result: ", result);
                                console.log("Item deleted");

                                window.updateCartItem();

                                //refresh cart
                                refreshCart();

                                //
                                refreshShoppingCart();
                            });
                    } else {
                        fetch(
                            `http://localhost:8000/mysql?mysqlQuery=update temp_table set product_quantity = product_quantity %2D 1 where product_id = ${json.id}`
                        )
                            .then((res) => res.json())
                            .then((result) => {
                                console.log("result: ", result);
                                //to update cart item number
                                window.updateCartItem();

                                //

                                // if((json.product_quantity-1) === 0)
                                refreshShoppingCart();
                            });
                    }
                });

                //appending buttons and counter to parent container
                itemQuantityContainer.append(itemIncrease);
                itemQuantityContainer.append(itemCount);
                itemQuantityContainer.append(itemDecrease);

                //appending
                shoppingItemDetails.append(titleTag);
                shoppingItemDetails.append(detailsTag);

                //
                // appending
                itemQuantityDiv.append(itemQuantityContainer);
                shoppingItemDetails.append(itemQuantityDiv);

                //div for price
                const shoppingItemPrice = document.createElement("div");
                shoppingItemPrice.classList.add("shoppingItemPrice");
                //price tag
                const priceTag = document.createElement("h4");
                priceTag.innerText = `$${json.price}`;

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
