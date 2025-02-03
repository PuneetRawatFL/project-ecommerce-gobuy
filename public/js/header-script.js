//loading cart-modal
let visible = "false";
$(function () {
    $(".cart-modal").load("../html/cart.html", function () {
        $.getScript("../js/cart-script.js");
        //to close the cart
        document.querySelector(".cart-close").addEventListener("click", () => {
            if (visible === "true") {
                document.querySelector(".cart-modal").style.right = "-100%";
                visible = "false";
                // document.querySelector(".blur").style.filter = "blur(0px)";
            }
        });
    });
    document.querySelector(".shopping-cart").addEventListener("click", () => {
        if (visible === "false") {
            document.querySelector(".cart-modal").style.right = "0";
            visible = "true";
        }
    });
});

//creating global array
// window.globalCartArray = [];

let cartCountStorage = 0;
//function to increase cart count
const cartCount = document.querySelector(".cart-item-count");
const cartIcon = document.querySelector("#cart-btn");
function updateCartItem() {
    fetch(
        `http://localhost:8000/mysql?mysqlQuery=select sum(product_quantity) as quantity from temp_table`
    )
        .then((res) => res.json())
        .then((result) => {
            // console.log("cart length", result[0].quantity);
            if (result[0].quantity > 0) {
                cartIcon.src = "../images/shopping-bag-filled.png";
                cartCount.style.visibility = "visible";
                cartCount.innerText = result[0].quantity;
            } else {
                cartIcon.src = "../images/shopping-bag-empty.png";
                cartCount.style.visibility = "hidden";
                // cartTotalDiv.style.visibility = "hidden";
            }
        });
}

//to make function available globally
window.updateCartItem = updateCartItem;

//drop down user details
let userIcon = document.querySelector(".user-icon");
console.log(userIcon);
let show = "false";
userIcon.addEventListener("click", () => {
    // console.log("hover");
    if (show === "false") {
        document.querySelector(".user-info").classList.add("show");
        show = "true";
    } else {
        document.querySelector(".user-info").classList.remove("show");
        show = "false";
    }
});
