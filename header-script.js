//loading cart-modal
let visible = "false";
$(function () {
    $(".cart-modal").load("cart.html", function () {
        //to close the cart
        document.querySelector(".cart-close").addEventListener("click", () => {
            if (visible === "true") {
                document.querySelector(".cart-modal").style.display = "none";
                visible = "false";
            }
        });
    });
    document.querySelector(".shopping-cart").addEventListener("click", () => {
        if (visible === "false") {
            document.querySelector(".cart-modal").style.display = "block";
            visible = "true";
        }
    });
});

//local storage
localStorage.setItem("cartCountStorage", 0);

let cartCountStorage = 1;
//function to increase cart count
function updateCartItem() {
    const cartCount = document.querySelector(".cart-item-count");
    if (cartCount) {
        cartCount.innerText = cartCountStorage;
        cartCountStorage++;
    }
    cartCount.style.visibility = "visible";
}
//to make function available globally
window.updateCartItem = updateCartItem;
