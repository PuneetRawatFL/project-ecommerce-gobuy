// cart total elemnt
let cartTotal = document.querySelector("#cart-total-price-span");

function addItemInCart(arr) {
	// let cartItemDiv = document.querySelector(".cart-items");
	let cartItemDiv = document.createElement("div");
	cartItemDiv.classList.add("cart-items");
	cartItemDiv.id = `cart-${arr[arr.length - 1].id}`;

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
	cartItemPrice.textContent = `$${arr[arr.length - 1].price}`;

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
	pItemCount.innerText = arr[arr.length - 1].quantity;
	pItemCount.id = "itemQuantity";
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
	let totalPrice = `${(
		parseFloat(cartTotal.innerText) +
		parseFloat(arr[arr.length - 1].price * arr[arr.length - 1].quantity)
	).toFixed(2)}`;
	cartTotal.innerText = totalPrice;
	// modifyCartTotal(arr, "add");

	//increase counter
	itemIncrease.addEventListener("click", () => {
		//increasing quantity
		arr[arr.length - 1].quantity++;
		pItemCount.innerText = arr[arr.length - 1].quantity;

		//to increase cart item number
		window.updateCartItem("increase");

		//update cart total
		window.modifyCartTotal();
	});

	//decrease counter
	itemDecrease.addEventListener("click", () => {
		//decreasing quantity
		arr[arr.length - 1].quantity--;
		pItemCount.innerText = arr[arr.length - 1].quantity;

		//to decrease cart item number
		window.updateCartItem("decrease");

		//remove item from list and array
		if (arr[arr.length - 1].quantity == 0) {
			let index;
			for (let x = 0; x < window.globalCartArray.length; x++) {
				if (cartItemDiv.id[5] == window.globalCartArray[x].id) {
					index = arr.indexOf(window.globalCartArray[x]);
					// --------------------------------
					// to remove the item from the cart list
					// - from list
					let cartList = document.querySelector(".cart-items-list");
					let removeItem = cartList.children[index];
					cartList.removeChild(removeItem);

					// - from array
					window.globalCartArray.splice(index, 1); // this will remove the item from global array
				}
			}
		}

		//update cart total
		window.modifyCartTotal();
	});
}

//making this function global
window.addItemInCart = addItemInCart;

//function to modify total price
function modifyCartTotal() {
	let totalPrice = 0;
	for (let index = 0; index < window.globalCartArray.length; index++) {
		totalPrice +=
			window.globalCartArray[index].price *
			window.globalCartArray[index].quantity;
	}
	totalPrice = parseFloat(totalPrice.toFixed(2));

	cartTotal.innerText = totalPrice;
}

window.modifyCartTotal = modifyCartTotal;

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
