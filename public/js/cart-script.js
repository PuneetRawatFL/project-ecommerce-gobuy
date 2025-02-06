// cart total elemnt
let cartTotal = document.querySelector("#cart-total-price-span");
const cartListDiv = document.querySelector(".cart-items-list");
const cartBottomDiv = document.querySelector(".cart-total-container");
const cartEmptyContent = document.querySelector(".empty-cart");

let cartEmpty = true;
function changeContent() {
    if (cartEmpty) {
        // console.log("change content function");
        cartBottomDiv.style.visibility = "hidden";
        cartEmptyContent.style.display = "flex";
        cartListDiv.classList.add("cart-items-list-empty");
        cartListDiv.classList.remove("cart-items-list-filled");
    } else {
        // console.log("else condition");
        cartBottomDiv.style.visibility = "visible";
        cartEmptyContent.style.display = "none";
        cartListDiv.classList.remove("cart-items-list-empty");
        cartListDiv.classList.add("cart-items-list-filled");
    }
}
changeContent();

const user = document.cookie.match(/(^| )userId=([^;]+)/);
const userId = parseInt(user[2], 10);

//display items from mysql database
function refreshCart() {
    fetch(
        `http://localhost:8000/mysql?mysqlQuery=select * from products p join cart c on p.id = c.product_id join users u on u.userId = c.user_id where u.userId=${userId}`
    )
        .then((res) => res.json())
        .then((result) => {
            // console.log(result.length);
            if (result.length == 0) {
                // console.log("Cart empty");
                cartEmpty = true;
                changeContent();
            } else {
                //empty list
                cartListDiv.innerHTML = "";
                result.forEach((item) => {
                    // console.log(item);
                    addItemInCart(item);

                    //
                    window.updateCartItem();
                });
            }
        });
}
window.refreshCart = refreshCart;
refreshCart();

function addItemInCart(json) {
    //change html of cartlist
    // console.log(json);
    cartEmpty = false;
    changeContent();

    // let cartItemDiv = document.querySelector(".cart-items");
    let cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-items");
    cartItemDiv.id = `cart-${json.id}`;

    //creating img div
    const itemImgDiv = document.createElement("div");
    itemImgDiv.classList.add("item-image");
    itemImgDiv.classList.add("item");

    // creating img tag
    const itemImg = document.createElement("img");
    itemImg.id = "item-image";
    // itemImg.src = json.image;
    itemImg.src = `http://localhost:8000/product-images/product_${json.id}.jpg`;
    // console.log(json.id);

    //appending img tag to div
    itemImgDiv.append(itemImg);

    //creating stack items div
    const stackItems = document.createElement("div");
    stackItems.classList.add("stack-items");

    // div for item detail and price
    const itemDetails = document.createElement("div");
    itemDetails.classList.add("itemDetails");
    itemDetails.classList.add("item");

    //p tags for detail and price
    const cartItemName = document.createElement("p");
    cartItemName.id = "item-details";
    cartItemName.classList.add("cartItemName");
    cartItemName.textContent = json.title;

    const cartItemPrice = document.createElement("p");
    cartItemPrice.id = "item-price";
    cartItemPrice.textContent = `$${json.price}`;

    // appending p tags to item detail div
    itemDetails.append(cartItemName);
    itemDetails.append(cartItemPrice);

    //creating quantity counter div
    const itemQuantityDiv = document.createElement("div");
    itemQuantityDiv.classList.add("item-quantity");
    itemQuantityDiv.classList.add("item");

    //creating quantity counter container
    const itemQuantityContainer = document.createElement("div");
    itemQuantityContainer.classList.add("item-quantity-container");

    //creating buttons and div for item count
    //increase btn
    const itemIncrease = document.createElement("button");
    itemIncrease.classList.add("counter");
    itemIncrease.id = "itemIncrease";
    itemIncrease.innerText = "+";

    //increase counter
    itemIncrease.addEventListener("click", () => {
        //increasing quantity
        console.log(json);
        // json.product_quantity++;
        // pItemCount.innerText = json.product_quantity;

        fetch(
            `http://localhost:8000/mysql?mysqlQuery=update cart c join users on c.user_id = users.userId set product_quantity = product_quantity %2B 1 where product_id =  ${json.id} and users.userId =${userId}`
        )
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                //to increase cart item number
                window.updateCartItem();
            });

        //refresh cart
        refreshCart();

        //update cart total
        window.modifyCartTotal();
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

    //decrease counter
    itemDecrease.addEventListener("click", () => {
        //decreasing quantity
        // console.log(json);
        // json.quantity--;
        // pItemCount.innerText = json.quantity;
        // console.log(json.product_quantity - 1);
        if (json.product_quantity - 1 == 0) {
            fetch(
                `http://localhost:8000/mysql?mysqlQuery=delete cart from cart join users on cart.user_id = users.userId where cart.product_id = ${json.id} and users.userId = ${userId}`
            )
                .then((res) => res.json())
                .then((result) => {
                    console.log("result: ", result);
                    // console.log("Item deleted");

                    // to remove the item
                    // - from list
                    let cartList = document.querySelector(".cart-items-list");
                    let removeItem = document.querySelector(
                        `#${cartItemDiv.id}`
                    );
                    // console.log(removeItem);
                    cartList.removeChild(removeItem);
                    //to update cart item number
                    window.updateCartItem();

                    //refresh cart
                    refreshCart();
                });
        } else {
            fetch(
                `http://localhost:8000/mysql?mysqlQuery=update cart c join users on c.user_id = users.userId set product_quantity = product_quantity %2D 1 where product_id =  ${json.id} and users.userId =${userId}`
            )
                .then((res) => res.json())
                .then((result) => {
                    console.log("result: ", result);
                    //to update cart item number
                    window.updateCartItem();

                    //

                    // if((json.product_quantity-1) === 0)
                });
        }

        //refresh cart
        refreshCart();

        //update cart total
        window.modifyCartTotal();
    });

    //appending buttons and counter to parent container
    itemQuantityContainer.append(itemIncrease);
    itemQuantityContainer.append(itemCount);
    itemQuantityContainer.append(itemDecrease);

    // appending
    itemQuantityDiv.append(itemQuantityContainer);

    //appending to item stack items div
    stackItems.append(itemDetails);
    stackItems.append(itemQuantityDiv);

    //appending to main div
    cartItemDiv.append(itemImgDiv);
    cartItemDiv.append(stackItems);

    // append to list
    document.querySelector(".cart-items-list").append(cartItemDiv);

    //change cart total
    window.modifyCartTotal();
}
//making this function global
window.addItemInCart = addItemInCart;

//function to modify total price
function modifyCartTotal() {
    // let totalPrice = 0;

    fetch(
        `http://localhost:8000/mysql?mysqlQuery=select sum(total_price) as cart_total from cart where cart.user_id =  ${userId}`
    )
        .then((res) => res.json())
        .then((result) => {
            cartTotal.innerText = result[0].cart_total;
            // console.log("cart total", result[0].cart_total);
            // result.forEach((item) => {
            //     totalPrice += item.price * item.product_quantity;
            //     totalPrice = parseFloat(totalPrice.toFixed(2));
            // });
        });
}

//making this function global
window.modifyCartTotal = modifyCartTotal;

//model for above cart item
//<div class="item-image item">
//        <img id="item-image" src="./images/sale_banner1.jpg" alt="" />
//      </div>
//      <div class="stack-items">
//        <div class="item-details item">
//          <p id="item-details">this is a detail</p>
//          <p id="item-price"></p>
//        </div>
//        <div class="item-quantity item">
//          <div class="item-quantity-container">
//            <button id="itemIncrease" class="counter">+</button>
//            <div id="itemCount"><p></p></div>
//            <button id="itemDecrease" class="counter">-</button>
//          </div>
//        </div>
//      </div>
