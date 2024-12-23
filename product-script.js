document.addEventListener("DOMContentLoaded", () => {
    //fetch announcement bar
    fetch("announcement-bar.html")
        .then((response) => response.text())
        .then((data) => {
            document.querySelector(".announcement-bar").innerHTML = data;
        });
});

// access accordian
var acc = document.getElementsByClassName("accordion");

for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("active");

        //access content
        var panel = this.nextElementSibling;

        //show and hide content
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }

        //add animation in panel opening
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}

//function to add loading bar
function loadingBar() {
    var loadingContainer = document.querySelector(".loading-container");
    loadingContainer.style.visibility = "visible";
}
//function to remove loading bar
function removeLoadingBar() {
    var loadingContainer = document.querySelector(".loading-container");
    loadingContainer.style.visibility = "hidden";
}

//function to manipulate dom and add items
function getProducts(url) {
    //creating button id
    let btnId = 1;

    //enable loading slider
    loadingBar();
    fetch(url)
        .then((res) => res.json())
        .then((products) => {
            // remove loading slider
            removeLoadingBar();

            //accessing containers
            const prodContainer = document.querySelector(".items-list");

            //clear previously fetched items
            prodContainer.innerHTML = " ";

            //creating loop for each product
            products.forEach((product) => {
                // console.log(product);

                //creating a div for link navigation

                // creating a div for each product
                const productDiv = document.createElement("div");
                productDiv.classList.add("product-item");

                // adding title
                const title = document.createElement("p");
                title.classList.add("product-name");
                title.textContent = product.title;

                //creating image div
                const imgDiv = document.createElement("a");
                imgDiv.classList.add("product.image");
                //adding product link to open in new page
                imgDiv.href = `product-page.html?id=${btnId}`;

                //adding image
                const image = document.createElement("img");
                image.classList.add("prod-image");
                image.src = product.image;
                image.alt = product.title;
                imgDiv.appendChild(image);

                //adding price
                const price = document.createElement("p");
                price.classList.add("product-price");
                price.textContent = `Price: $${product.price}`;

                //adding 'add to cart' button
                const btn = document.createElement("button");
                btn.classList.add("addButton");
                btn.textContent = "Add to Cart";
                btn.id = `${btnId}`;
                btnId++;

                // Append elements to productDiv
                productDiv.appendChild(imgDiv);
                productDiv.appendChild(title);
                productDiv.appendChild(price);
                productDiv.appendChild(btn);

                // Append the product div to the container
                prodContainer.appendChild(productDiv);
            });
            //add event listener to add to cart
            addToCart();
        });
}
//invoke function by default
getProducts("https://fakestoreapi.com/products");

//adding filters fetch

//category filter
//access elements
let cat1 = document.querySelector("#cat1"); //all
let cat2 = document.querySelector("#cat2"); //electronics
let cat3 = document.querySelector("#cat3"); //jewelry
let cat4 = document.querySelector("#cat4"); //mens clothing
let cat5 = document.querySelector("#cat5"); //womens clothing

//all clothing category
cat1.addEventListener("click", () => {
    getProducts("https://fakestoreapi.com/products");
    console.log("category 4");
});
//electronics category
cat2.addEventListener("click", () => {
    getProducts("https://fakestoreapi.com/products/category/electronics");
});
//jewelry category
cat3.addEventListener("click", () => {
    getProducts("https://fakestoreapi.com/products/category/jewelery");
});
//men clothing category
cat4.addEventListener("click", () => {
    getProducts("https://fakestoreapi.com/products/category/men's clothing");
});
//women clothing category
cat5.addEventListener("click", () => {
    getProducts("https://fakestoreapi.com/products/category/women's clothing");
});

//sort by filter
let sort1 = document.querySelector("#sort1");
let sort2 = document.querySelector("#sort2");
//ascending
sort1.addEventListener("click", () => {
    getProducts("https://fakestoreapi.com/products?sort=asc");
    console.log("category 4");
});
//descending
sort2.addEventListener("click", () => {
    getProducts("https://fakestoreapi.com/products?sort=desc");
    console.log("category 4");
});

//reset button
let resetBtn = document.querySelector(".reset");
resetBtn.addEventListener("click", () => {
    getProducts("https://fakestoreapi.com/products");
});

//loading header script

$(function () {
    // Declare a global object to store references to elements

    $("#footer").load("footer.html");
    $(".navbar").load("header.html", function () {
        $.getScript("header-script.js");
    });
});

const cartItemsArray = [];

//opening cart modal on add to cart button
function addToCart() {
    let addToCartBtns = document.querySelectorAll(".addButton");
    addToCartBtns.forEach((button) => {
        button.addEventListener("click", () => {
            window.updateCartItem();
            console.log(button.id);
            fetch(`https://fakestoreapi.com/products/${button.id}`)
                .then((res) => res.json())
                .then((json) => {
                    console.log(
                        "cart items" + document.querySelector(".cart-items")
                    );
                    // console.log(json);
                    cartItemsArray.push(json);
                    addToCartItems();
                });
        });
    });
}

//add items to cart
function addToCartItems() {
    console.log(
        "cart items" + document.querySelector("#item-details").innerText
    );
    console.log(cartItemsArray);
}
