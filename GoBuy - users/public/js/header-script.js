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

let cartCountStorage = 0;
//function to increase cart count
const cartCount = document.querySelector(".cart-item-count");
const cartIcon = document.querySelector("#cart-btn");
function updateCartItem() {
    const user = document.cookie.match(/(^| )userId=([^;]+)/);

    if (user) {
        const userId = parseInt(user[2], 10);
        fetch(
            `http://localhost:8000/mysql?mysqlQuery=select sum(product_quantity) as quantity from cart t join users u on t.user_id = u.userId where u.userId = ${userId}`
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
}

//to make function available globally
window.updateCartItem = updateCartItem;

//drop down user details
let userIcon = document.querySelector(".user-icon");
// console.log(userIcon);
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

//login
const userTag = document.querySelector(".user-name");
const userBtn = document.querySelector("#user-btn");
const userLogoutOptions = document.querySelector(".user-logout-options");
const userLoginOptions = document.querySelector(".user-login-options");
// console.log(userBtn);

async function userLoggedIn(userName, userId) {
    userTag.innerText = `Hello, ${userName}`;
    userLoginOptions.style.display = "none";
    userLogoutOptions.style.display = "block";

    // const response = await fetch(
    //     `http://localhost:8000/mysql?mysqlQuery=select gender from users where userId = ${userId};`
    // );
    // const result = await response.json();
    // console.log(result[0].gender);

    fetch(
        `http://localhost:8000/mysql?mysqlQuery=select gender from users where userId = ${userId};`
    )
        .then((response) => response.json())
        .then((result) => {
            // console.log(result[0].gender);

            if (result[0].gender == "male") {
                userBtn.src = "../images/male-icon.png";
            }
            if (result[0].gender == "female") {
                userBtn.src = "../images/female-icon.png";
            }
        });

    // console.log((document.cookie = "token"));
}
window.userLoggedIn = userLoggedIn;

//logout
const logoutBtn = document.querySelector("#logout-btn");
logoutBtn.addEventListener("click", () => {
    event.preventDefault();
    userTag.innerText = `Not a user? Login`;
    userLoginOptions.style.display = "block";
    userLogoutOptions.style.display = "none";
    userBtn.src = "../images/notLoggedIn.png";

    console.log("logout");

    //delete cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    // console.log(document.cookie);

    // window.location.href = "../html/index.html";

    toastr.success(
        ``, //message
        "You have been logged out successfully", //title
        {
            timeOut: 2000,
            progressBar: true,
        } //timeout
    );

    setTimeout(() => {
        window.location.href = "../html/index.html";
    }, 2000);

    // window.refreshCart();
});

//function to check if the user is logged in
async function checkUser() {
    const hasToken = document.cookie.includes("token=");
    console.log(hasToken);

    if (hasToken) {
        const details = await getDetailFromToken();
        // console.log("details", details);
        //calling function
        userLoggedIn(details.name, details.userId);

        document.cookie = `userId = ${details.userId}; path=/`;
    }
    return hasToken;
}
window.checkUser = checkUser;
checkUser();

async function getDetailFromToken() {
    //extracting token value using regex
    const match = document.cookie.match(/(^| )token=([^;]+)/);
    // console.log(match[2]);

    // Decode the JWT using jwt-decode script
    const decoded = jwt_decode(match[2]);

    // Log the decoded payload
    // console.log("Decoded Payload:", decoded);

    //trying fetch
    const response = await fetch(
        `http://localhost:8000/mysql?mysqlQuery=select * from users where email='${decoded.email}'`
    );
    const result = await response.json();
    // console.log("result: ", result[0]);
    // console.log(result[0].name);

    //return user details
    return result[0];
}
window.getDetailFromToken = getDetailFromToken;
