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
        console.log("else condition");
        cartBottomDiv.style.visibility = "visible";
        cartEmptyContent.style.display = "none";
        cartListDiv.classList.remove("cart-items-list-empty");
        cartListDiv.classList.add("cart-items-list-filled");
    }
}
changeContent();

//display items from mysql database
function refreshCart() {
    fetch(
        "http://localhost:8000/mysql?mysqlQuery=select * from products p join temp_table t where p.id = t.product_id"
    )
        .then((res) => res.json())
        .then((result) => {
            console.log(result.length);
            if (result.length == 0) {
                console.log("Cart empty");
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
            `http://localhost:8000/mysql?mysqlQuery=update temp_table set product_quantity = product_quantity %2B 1 where product_id = ${json.id}`
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
        console.log(json);
        // json.quantity--;
        // pItemCount.innerText = json.quantity;
        console.log(json.product_quantity - 1);
        if (json.product_quantity - 1 == 0) {
            fetch(
                `http://localhost:8000/mysql?mysqlQuery=delete from temp_table where product_id = ${json.id}`
            )
                .then((res) => res.json())
                .then((result) => {
                    console.log("result: ", result);
                    console.log("Item deleted");

                    // to remove the item
                    // - from list
                    let cartList = document.querySelector(".cart-items-list");
                    let removeItem = document.querySelector(
                        `#${cartItemDiv.id}`
                    );
                    console.log(removeItem);
                    cartList.removeChild(removeItem);
                    //to update cart item number
                    window.updateCartItem();

                    //refresh cart
                    refreshCart();
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
                });

            // //remove item from list and array
            // if (json.quantity == 0) {
            //     let index;
            //     for (let x = 0; x < window.globalCartArray.length; x++) {
            //         if (cartItemDiv.id[5] == window.globalCartArray[x].id) {
            //             console.log("quantity", json.quantity);
            //             console.log(index);
            //             index = window.globalCartArray.indexOf(
            //                 window.globalCartArray[x]
            //             );

            //             // - from array
            //             // window.globalCartArray.splice(index, 1); // this will remove the item from global array
            //         }
            //     }
            // }
        }
        //refresh cart
        refreshCart();

        //to decrease cart item number
        // window.updateCartItem();

        //update cart total
        window.modifyCartTotal();

        //to change content if no items are left
        if (window.globalCartArray.length == 0) {
            console.log("cart is empty");
            cartEmpty = true;
            changeContent();
        }
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

// if the item already exists
// function itemExits(jsonId) {
//     for (let x = 0; x < window.globalCartArray.length; x++) {
//         if (jsonId == window.globalCartArray[x].id) {
//             //increase quantity
//             window.globalCartArray[x].quantity += 1;

//             //changing item count in cart
//             document.querySelector(`#itemQuantity-${jsonId}`).innerText =
//                 window.globalCartArray[x].quantity;

//             //update cart total
//             window.modifyCartTotal();
//         }
//     }
// }
// window.itemExits = itemExits;

//function to modify total price
function modifyCartTotal() {
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
                cartTotal.innerText = totalPrice;
            });
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
