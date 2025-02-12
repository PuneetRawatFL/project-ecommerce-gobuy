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

// Add this JavaScript code to your script
document.addEventListener("DOMContentLoaded", (event) => {
    document.body.classList.add("fade-transition");
    setTimeout(() => {
        document.body.classList.add("fade-in");
    }, 100); // Adjust the timeout if needed
});

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

//enable loading bar
loadingBar();

//fetch product id from url
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

//fetching product details from product id
fetch(`http://localhost:8000/products/${productId}`)
    .then((res) => res.json())
    .then((json) => {
        // console.log(json[0]);
        //making body visible
        document.querySelector(".product-container").style.visibility =
            "visible";

        //accesing elements

        //navbar elements
        let productNavigation = document.querySelector("#product-navigation");

        //rating section
        let ratingStar = document.querySelector("#rating-star");
        ratingStar.src = "../images/rating-star.png";

        //product elements
        let productTitle = document.querySelector("#product-title");
        let productImage = document.querySelector("#product-image");
        let productDescription = document.querySelector("#product-description");
        let productPrice = document.querySelector("#product-price");
        let productPriceMrp = document.querySelector("#price-mrp");
        let productRatingCount = document.querySelector("#rating-count");
        let productRatingStar = document.querySelector("#rating-stars");

        //modifying content

        //navigation bar content
        productNavigation.innerText = json[0].title;

        //product content
        productTitle.innerText = json[0].title;
        //product price
        productPrice.innerHTML = `$${json[0].price} <span class="old-mrp">$${(
            json[0].price + 10
        ).toFixed(2)}</span> <span class="discount-offer">${Math.round(
            (10 / json[0].price) * 100
        )}% off</span>`;
        //styling line-through mrp
        const oldmrp = document.querySelector(".old-mrp");
        oldmrp.style.fontSize = "1rem";
        oldmrp.style.fontWeight = "200";
        oldmrp.style.textDecoration = "line-through";
        //styling discount percentage
        const discountOffer = document.querySelector(".discount-offer");
        discountOffer.style.fontSize = "1.1rem";
        discountOffer.style.color = "green";
        discountOffer.style.fontWeight = "400";

        productPriceMrp.innerText = "MRP(Inclusive of all taxes)";
        // productImage.src = json[0].image;
        productImage.src = `http://localhost:8000/product-images/product_${json[0].id}.jpg`;

        productDescription.innerText = json[0].description;
        productRatingCount.innerText = json[0].rating_count;
        productRatingStar.innerText = json[0].rating_rate;
        //removing loading bar
        removeLoadingBar();

        //event listener for add to cart
        addToCart.addEventListener("click", () => {
            // console.log("cart");

            //creating flag
            // let itemExist = false;

            // to check if the item already exists
            fetch(
                `http://localhost:8000/mysql?mysqlQuery=select * from temp_table where product_id = ${json[0].id}`
            )
                .then((res) => res.json())
                .then((result) => {
                    // console.log(result);

                    if (result.length === 0) {
                        console.log(result.length);
                        console.log("item dont exists");

                        //to increase cart item number
                        window.updateCartItem("increase");

                        //add to mysql database
                        fetch("http://localhost:8000/addToCart", {
                            method: "POST",
                            headers: {
                                "Content-type": "application/json",
                            },
                            body: JSON.stringify({ data: json[0] }),
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
                            `http://localhost:8000/mysql?mysqlQuery=update temp_table set product_quantity = product_quantity %2B 1 where product_id = ${json[0].id}`
                        )
                            .then((res) => res.json())
                            .then((result) => {
                                console.log(result);
                                //to increase cart item number
                                window.updateCartItem();

                                //window
                                window.refreshCart();
                            });
                    }
                });
        });
    });
