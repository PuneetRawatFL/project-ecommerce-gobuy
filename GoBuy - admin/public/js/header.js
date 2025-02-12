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

function userLoggedIn(userName) {
    userTag.innerText = `Hello, ${userName}`;
    userLoginOptions.style.display = "none";
    userLogoutOptions.style.display = "block";
    userBtn.src = "../images/user_logged_in.png";

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
    userBtn.src = "../images/user_logged_out.png";

    $(function () {
        // toastr.success("success message");
        toastr.success(
            "Logged out successfully.", //message
            "", //title
            { timeOut: 2000, closeButton: true, progressBar: true } //timeout
        );
    });

    //delete cookie
    document.cookie =
        "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "adminId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    setTimeout(() => {
        window.location.href = "../html/index.html";
    }, 2000);
});

//function to check if the user is logged in
async function checkUser() {
    const hasToken = document.cookie.includes("adminToken=");
    console.log("User logged in - ", hasToken);

    if (hasToken) {
        const details = await getDetailFromToken();
        // console.log("details", details);
        //calling function
        userLoggedIn(details.name);

        document.cookie = `adminId = ${details.id}; path=/`;
        return hasToken;
    } else {
        console.log("User not logged in");
    }
}
window.checkUser = checkUser;
checkUser();

async function getDetailFromToken() {
    //extracting token value using regex
    const match = document.cookie.match(/(^| )adminToken=([^;]+)/);
    // console.log(match[2]);

    // Decode the JWT using jwt-decode script
    const decoded = jwt_decode(match[2]);

    // Log the decoded payload
    // console.log("Decoded Payload:", decoded);

    //trying fetch
    // const response = await fetch(
    //     `http://localhost:8001/mysql?mysqlQuery=select * from admin where email='${decoded.email}'`
    // );
    // const result = await response.json();
    // console.log("result: ", result[0]);
    // console.log(result[0].name);

    //return user details
    return decoded;
}
window.getDetailFromToken = getDetailFromToken;
