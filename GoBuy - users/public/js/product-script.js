try {
    const user = document.cookie.match(/(^| )userId=([^;]+)/);
    const userId = parseInt(user[2], 10);
    console.log("userid", userId);
} catch {
    console.error("user not logged in");
}

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
                // console.log(product.id);

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
                imgDiv.href = `product-page.html?id=${product.id}`;

                //adding image
                const image = document.createElement("img");
                image.classList.add("prod-image");
                // image.src = product.image;
                image.src = `http://localhost:8000/product-images/product_${product.id}.jpg`;
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

                //user id

                //adding eventlistener
                btn.addEventListener("click", () => {
                    const user = document.cookie.match(/(^| )userId=([^;]+)/);
                    const userId = parseInt(user[2], 10);
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
                                    .catch((err) => console.log("Error:", err));
                            }

                            //if item exist -> increase quantity in mysql table
                            else {
                                console.log("item exists");
                                fetch(
                                    `http://localhost:8000/mysql?mysqlQuery=update cart c join users u on c.user_id = u.userId set product_quantity = product_quantity %2B 1 where product_id = ${btn.id}`
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
                });

                // Append elements to productDiv
                productDiv.appendChild(imgDiv);
                productDiv.appendChild(title);
                productDiv.appendChild(price);
                productDiv.appendChild(btn);

                // Append the product div to the container
                prodContainer.appendChild(productDiv);
            });
            //add event listener to add to cart
            // addToCart();
        });
}
//invoke function by default
// getProducts("http://localhost:8000/products");
getProducts("http://localhost:8000/products");

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
    getProducts("http://localhost:8000/products");
    console.log("category 4");
});
//electronics category
cat2.addEventListener("click", () => {
    getProducts("http://localhost:8000/products/category/electronics");
});
//jewelry category
cat3.addEventListener("click", () => {
    getProducts("http://localhost:8000/products/category/jewelery");
});
//men clothing category
cat4.addEventListener("click", () => {
    getProducts("http://localhost:8000/products/category/men's clothing");
});
//women clothing category
cat5.addEventListener("click", () => {
    getProducts("http://localhost:8000/products/category/women's clothing");
});

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

// //creating global array
// window.globalCartArray = [];

// no use ----------------------------------

//opening cart modal on add to cart button
function addToCart() {
    let addToCartBtns = document.querySelectorAll(".addButton");
    console.log("fuction call");
    addToCartBtns.forEach((button) => {
        button.addEventListener("click", () => {
            // add loading animation
            addToCartLoading(`${button.id}`);
            console.log("click");

            fetch(
                `http://localhost:8000/mysql?mysqlQuery=select * from temp_table where product_id = ${button.id}`
            )
                .then((res) => res.json())
                .then((result) => {
                    //remove loading animation
                    removeAddButtonLoading(`${button.id}`);
                    console.log("HELLOOOOOOOOO");

                    // console.log(result);

                    if (result.length === 0) {
                        console.log(result.length);
                        console.log("item dont exists hello");

                        //to increase cart item number
                        window.updateCartItem();

                        json[0].userId = "hello";
                        console.log(json[0]);

                        //add to mysql database
                        fetch("http://localhost:8000/addToCart", {
                            method: "POST",
                            headers: {
                                "Content-type": "application/json",
                            },
                            body: JSON.stringify({
                                data: json[0],
                            }),
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                console.log("Success:", data);
                                window.refreshCart();
                            })
                            .catch((err) => console.log("Error:", err));
                    }

                    //if item exist -> increase quantity in mysql table
                    else {
                        console.log("item exists");
                        fetch(
                            `http://localhost:8000/mysql?mysqlQuery=update temp_table set product_quantity = product_quantity %2B 1 where product_id = ${button.id}`
                        )
                            .then((res) => res.json())
                            .then((result) => {
                                console.log(result);
                                //to increase cart item number
                                window.updateCartItem();
                            });
                    }
                });
        });
    });
}
