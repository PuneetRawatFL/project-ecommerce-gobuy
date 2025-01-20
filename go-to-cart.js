// fetching header, footer and announcement bar

//loading header script
$(function () {
    //announcement bar
    $(".announcement-bar").load("announcement-bar.html");
    //header
    $(".navbar").load("header.html", function () {
        $.getScript("header-script.js");
    });
    //footer
    $("#footer").load("footer.html");
});

const shoppingList = document.querySelector(".shopping-cart-list");

//trial product
fetch(`http://localhost:8000/products/category/jewelery`)
    .then((res) => res.json())
    // .then((json) => {
    .then((products) => {
        // console.log(json);

        products.forEach((json) => {
            //creating div for each product
            const shoppingCartItem = document.createElement("div");
            shoppingCartItem.classList.add("shoppingCartItem");

            //div for image
            const shoppingItemImage = document.createElement("div");
            shoppingItemImage.classList.add("shoppingItemImage");
            //image tag
            const imagTag = document.createElement("img");
            imagTag.src = `http://localhost:8000/product-images/product_1.jpg`;
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
            //appending
            shoppingItemDetails.append(titleTag);
            shoppingItemDetails.append(detailsTag);

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
        });
    });
