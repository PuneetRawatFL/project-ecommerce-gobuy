//loading cart-modal
let visible = "false";
$(function () {
    $(".cart-modal").load("cart.html", function () {
        $.getScript("cart-script.js");
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
            // document.querySelector(".blur").style.filter = "blur(5px)";
            // console.log(window.globalCartArray);
        }
    });
});

//local storage
// localStorage.setItem("cartCountStorage", 0);

//creating global array
window.globalCartArray = [];

let cartCountStorage = 0;
//function to increase cart count
const cartCount = document.querySelector(".cart-item-count");
const cartIcon = document.querySelector("#cart-btn");
function updateCartItem(str) {
    cartIcon.src = "./images/shopping-bag-filled.png";
    // cartTotalDiv.style.visibility = "visible";

    if (str === "increase") {
        cartCountStorage += 1;
        if (cartCountStorage) {
            cartCount.innerText = cartCountStorage;
        }
        cartCount.style.visibility = "visible";
    } else if (str === "decrease") {
        cartCountStorage -= 1;
        if (cartCountStorage) {
            cartCount.innerText = cartCountStorage;
        } else {
            cartCount.style.visibility = "hidden";
            cartIcon.src = "./images/shopping-bag-empty.png";
            // cartTotalDiv.style.visibility = "hidden";
        }
    }
}

//to make function available globally
window.updateCartItem = updateCartItem;
