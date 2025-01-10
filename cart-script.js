// let itemImg = document.querySelector("#item-image"); //item image
// console.log(itemImg.src); - done
// let itemName = document.querySelector("#item-details"); //item name
// console.log(itemName.innerText); - done

// cart total elemnt
let cartTotal = document.querySelector("#cart-total-price-span");

function addItemInCart(arr) {
    console.log(arr[arr.length - 1]);
    console.log(arr[arr.length - 1].id);

    // let cartItemDiv = document.querySelector(".cart-items");
    let cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-items");
    cartItemDiv.id = `${arr[arr.length - 1].id}-cart`;
    console.log("Cart id", cartItemDiv.id);

    //creating img div
    const itemImgDiv = document.createElement("div");
    itemImgDiv.classList.add("item-image");
    itemImgDiv.classList.add("item");

    // creating img tag
    const itemImg = document.createElement("img");
    itemImg.id = "item-image";
    itemImg.src = arr[arr.length - 1].image;

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
    cartItemName.textContent = arr[arr.length - 1].title;

    const cartItemPrice = document.createElement("p");
    cartItemPrice.id = "item-price";
    cartItemPrice.textContent = arr[arr.length - 1].price;

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

    //count div
    const itemCount = document.createElement("div");
    itemCount.id = "itemCount";
    //p tag for count
    const pItemCount = document.createElement("p");
    pItemCount.innerText = "1";
    //appending
    itemCount.append(pItemCount);

    //decrease btn
    const itemDecrease = document.createElement("button");
    itemDecrease.classList.add("counter");
    itemDecrease.id = "itemDecrease";
    itemDecrease.innerText = "-";

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
    cartTotal.innerText = `${(
        parseFloat(cartTotal.innerText) + parseFloat(arr[arr.length - 1].price)
    ).toFixed(2)}`;

    //increase decrease counter
    itemIncrease.addEventListener("click", () => {
        let counterCount = pItemCount.innerText;
        counterCount++;
        pItemCount.innerText = counterCount;
        console.log("item increase");
    });

    itemDecrease.addEventListener("click", () => {
        let counterCount = pItemCount.innerText;
        counterCount--;
        console.log(cartItemDiv.id);
        if (counterCount == 0) {
            let index;
            console.log(cartItemDiv.id[0]);
            for (let x = 0; x < window.globalCartArray.length; x++) {
                if (cartItemDiv.id[0] == window.globalCartArray[x].id) {
                    index = arr.indexOf(window.globalCartArray[x]);
                    console.log("item found to remove", index);

                    // --------------------------------
                    // to remove the item from the cart list
                    // - from list
                    let cartList = document.querySelector(".cart-items-list");
                    let removeItem = cartList.children[index];
                    console.log(removeItem);
                    cartList.removeChild(removeItem);
                    // - from array ----------------------------- pending
                }
            }
            console.log("index", index);
        }
        pItemCount.innerText = counterCount;
        console.log("item decrease");
    });
}

//making this function global
window.addItemInCart = addItemInCart;

// window.hello = hello;
// window.addItemInCart();
// window.addItemInCart();

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
