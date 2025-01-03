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
console.log(productId);

//fetching product details from product id
fetch(`https://fakestoreapi.com/products/${productId}`)
    .then((res) => res.json())
    .then((json) => {
        //making body visible
        document.querySelector(".product-container").style.visibility =
            "visible";

        //accesing elements

        //navbar elements
        let productNavigation = document.querySelector("#product-navigation");

        //rating section
        let ratingStar = document.querySelector("#rating-star");
        ratingStar.src = "./images/rating-star.png";

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
        productNavigation.innerText = json.title;

        //product content
        productTitle.innerText = json.title;
        //product price
        productPrice.innerHTML = `$${json.price} <span class="old-mrp">$${(json.price + 10).toFixed(2)}</span> <span class="discount-offer">${Math.round((10 / json.price) * 100)}% off</span>`;
        //styling line-through mrp
        const oldmrp = document.querySelector(".old-mrp");
        oldmrp.style.fontSize = "1rem";
        oldmrp.style.fontWeight = "200";
        oldmrp.style.textDecoration = 'line-through';
        //styling discount percentage
        const discountOffer= document.querySelector(".discount-offer");
        discountOffer.style.fontSize = "1.1rem";
        discountOffer.style.color = "green";
        discountOffer.style.fontWeight = "400";

        productPriceMrp.innerText = "MRP(Inclusive of all taxes)";
        productImage.src = json.image;
        productDescription.innerText = json.description;
        productRatingCount.innerText = json.rating.count;
        productRatingStar.innerText = json.rating.rate;
        //removing loading bar
        removeLoadingBar();
    });

//add to cart count
let addToCart = document.querySelector("#addToCart");
addToCart.addEventListener("click", () => {
    console.log("Button click");
    window.updateCartItem(1);
});
