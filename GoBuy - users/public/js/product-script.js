let userId = "";
try {
    const user = document.cookie.match(/(^| )userId=([^;]+)/);
    userId = parseInt(user[2], 10);
    console.log("userid", userId);
} catch {
    console.error("user not logged in");
}
console.log(userId);

document.addEventListener("DOMContentLoaded", () => {
    //fetch announcement bar
    fetch("announcement-bar.html")
        .then((response) => response.text())
        .then((data) => {
            document.querySelector(".announcement-bar").innerHTML = data;
        });
});

//loading header script

$(function () {
    $(".navbar").load("header.html", function () {
        $.getScript("../js/header-script.js");
    });
    $("#footer").load("footer.html");
});

// Add this JavaScript code to your script
document.addEventListener("DOMContentLoaded", (event) => {
    document.body.classList.add("fade-transition");
    setTimeout(() => {
        document.body.classList.add("fade-in");
    }, 100); // Adjust the timeout if needed
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
                // console.log(product.prod_image_id);

                //creating a div for link navigation

                // creating a div for each product
                const productDiv = document.createElement("div");
                productDiv.classList.add("product-item");

                const heartImgDiv = document.createElement("div");
                heartImgDiv.style.display = "flex";
                heartImgDiv.style.justifyContent = "flex-end";

                const heartImg = document.createElement("img");
                heartImg.classList.add("heartImg");
                heartImg.id = `heart-${product.id}`;
                heartImg.src = "../images/heart.png";

                heartImg.addEventListener("click", () => {
                    console.log("product: ", product.id);
                    heartImg.src = "../images/heart (1).png";
                    fetch(
                        `http://localhost:8000/mysql?mysqlQuery=insert into wishlist values(${product.id}, ${userId})`
                    );
                });

                heartImgDiv.append(heartImg);
                productDiv.append(heartImgDiv);

                // adding title
                const title = document.createElement("p");
                title.classList.add("product-name");
                title.textContent = product.title;

                //creating image div
                const imgDiv = document.createElement("a");
                imgDiv.classList.add("product.image");
                //adding product link to open in new page
                imgDiv.href = `product-page.html?id=${product.id}`;

                //adding image
                const image = document.createElement("img");
                image.classList.add("prod-image");
                // image.src = product.image;
                // image.src = `http://localhost:8000/product-images/product_${product.id}-${product.prod_image_id}.jpg`;
                image.src = `http://localhost:8001/uploads/${product.product_image}`;
                // console.log(image.src);
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
                btn.id = `${product.id}`;
                btnId++;

                function addToCartHandler() {
                    const user = document.cookie.match(/(^| )userId=([^;]+)/);
                    if (user) {
                        const userId = parseInt(user[2], 10);
                        console.log(btn.id);
                        // console.log("button: ", btn);
                        //add loading animation
                        addToCartLoading(`${btn.id}`);
                        fetch(
                            `http://localhost:8000/mysql?mysqlQuery=select * from cart c join users u on c.user_id = u.userId where u.userId =${userId} and product_id = ${btn.id}`
                        )
                            .then((res) => res.json())
                            .then((result) => {
                                //remove loading animation
                                removeAddButtonLoading(`${btn.id}`);

                                console.log(result);

                                if (result.length === 0) {
                                    // console.log(result.length);
                                    console.log("item dont exists");

                                    //to increase cart item number
                                    window.updateCartItem();

                                    const user =
                                        document.cookie.match(
                                            /(^| )userId=([^;]+)/
                                        );
                                    const userId = parseInt(user[2], 10);
                                    // product.userId = userId;

                                    //add to mysql database
                                    fetch("http://localhost:8000/addToCart", {
                                        method: "POST",
                                        headers: {
                                            "Content-type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            data: product,
                                            userId: userId,
                                        }),
                                    })
                                        .then((res) => res.json())
                                        .then((data) => {
                                            console.log("Success:", data);
                                            window.refreshCart();
                                        })
                                        .catch((err) =>
                                            console.log("Error:", err)
                                        );
                                }

                                //if item exist -> increase quantity in mysql table
                                else {
                                    console.log("item exists");
                                    fetch(
                                        `http://localhost:8000/mysql?mysqlQuery=
                                        update cart c join users u on c.user_id = u.userId set product_quantity = product_quantity %2B 1 where product_id = ${btn.id};
                                        update products set sku = sku %2D 1 where id = ${btn.id};
                                        `
                                    )
                                        .then((res) => res.json())
                                        .then((result) => {
                                            console.log(result);
                                            //to increase cart item number
                                            window.updateCartItem();

                                            //refresh cart
                                            window.refreshCart();
                                        });
                                }
                            });
                    } else {
                        toastr.error(
                            "Please Login first", //message
                            "", //title
                            {
                                timeOut: 2000,
                                progressBar: true,
                            } //timeout
                        );
                    }
                }

                //adding eventlistener
                btn.addEventListener("click", addToCartHandler);

                // Append elements to productDiv
                productDiv.appendChild(imgDiv);
                productDiv.appendChild(title);
                productDiv.appendChild(price);
                productDiv.appendChild(btn);

                // Append the product div to the container
                prodContainer.appendChild(productDiv);

                //sku
                // console.log(product.sku);
                if (product.sku == 0) {
                    productDiv.style.backgroundColor = "#cccccc";
                    productDiv.style.color = "#666666";
                    // productDiv.style.cursor = "not-allowed";
                    productDiv.style.opacity = "0.5";

                    btn.removeEventListener("click", addToCartHandler);
                    btn.classList.remove("addButton");
                    btn.classList.add("disableButton");
                    btn.innerText = "Out of stock";
                }
            });
        });
}
//invoke function by default
// getProducts("http://localhost:8000/products");
getProducts(
    `http://localhost:8000/mysql?mysqlQuery=select * from products p join categories c on p.category = c.cat_name where cat_status = 'active'`
);

//adding filters fetch

//category filter

//fetch categories
async function fetchCategories() {
    const categoryPanel = document.querySelector("#categoryPanel");
    // console.log(categoryPanel);
    const response = await fetch(
        `http://localhost:8000/mysql?mysqlQuery=select * from categories where cat_status = 'active' order by cat_name asc`
    );
    const result = await response.json();
    result.forEach((cat) => {
        // console.log(cat);

        const category = document.createElement("p");
        category.innerText = `${cat.cat_name}`;
        // console.log(cat1.innerText);

        category.addEventListener("click", () => {
            getProducts(
                `http://localhost:8000/products/category/${cat.cat_name}`
            );
            console.log("category 4");
        });

        categoryPanel.append(category);
    });
}
fetchCategories();

//access elements
let cat1 = document.querySelector("#cat1"); //all
let cat2 = document.querySelector("#cat2"); //electronics
let cat3 = document.querySelector("#cat3"); //jewelry
let cat4 = document.querySelector("#cat4"); //mens clothing
let cat5 = document.querySelector("#cat5"); //womens clothing

//all clothing category

//sort by filter
let sort1 = document.querySelector("#sort1");
let sort2 = document.querySelector("#sort2");
let sort3 = document.querySelector("#sort3");
let sort4 = document.querySelector("#sort4");
//ascending
sort1.addEventListener("click", () => {
    getProducts("http://localhost:8000/products?sort=asc");
});
//descending
sort2.addEventListener("click", () => {
    getProducts("http://localhost:8000/products?sort=desc");
});
//price low to high
sort3.addEventListener("click", () => {
    getProducts("http://localhost:8000/products?sort=price_asc");
});
//price high to low
sort4.addEventListener("click", () => {
    getProducts("http://localhost:8000/products?sort=price_desc");
});

//reset button
let resetBtn = document.querySelector(".reset");
resetBtn.addEventListener("click", () => {
    getProducts("http://localhost:8000/products");
});

// function to add loading animaton to add to cart button
function addToCartLoading(btnId) {
    const btn = document.getElementById(`${btnId}`);
    btn.classList.add("addButtonLoadingExtra");
    btn.style.backgroundColor = "#36558f";

    btn.innerText = "";

    const loadingdiv = document.createElement("div");
    loadingdiv.classList.add("addButtonLoading");
    //
    btn.appendChild(loadingdiv);
}

function removeAddButtonLoading(btnId) {
    const btn = document.getElementById(`${btnId}`);
    btn.classList.remove("addButtonLoadingExtra");
    btn.style.backgroundColor = "#ffffff";
    btn.innerHTML = "";
    btn.textContent = "Add to Cart";
}

async function checkWishlist() {
    const res = await fetch(
        `http://localhost:8000/mysql?mysqlQuery=select product_id from wishlist where user_id = ${userId}`
    );
    const result = await res.json();
    // console.log(result);
    result.forEach((prodId) => {
        // console.log(prodId.product_id);
        const img = document.querySelector(`#heart-${prodId.product_id}`);
        // console.log(img);
        img.src = "../images/heart (1).png";
    });
}
checkWishlist();
