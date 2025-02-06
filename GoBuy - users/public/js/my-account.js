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

async function displayDetails() {
    const user = document.cookie.match(/(^| )userId=([^;]+)/);
    const userId = parseInt(user[2], 10);

    const response = await fetch(
        `http://localhost:8000/mysql?mysqlQuery=select * from users u join addresses a on u.userId = a.userId where u.userId = ${userId}`
    );

    if (response.ok) {
        const data = await response.json();
        console.log("user data", data[0]);
        const userName = document.querySelector("#userName");
        const userEmail = document.querySelector("#userEmail");
        const userAddress = document.querySelector("#userAddress");

        userName.innerText = data[0].name;
        userEmail.innerText = data[0].email;
        userAddress.innerText = data[0].address;
    } else {
        console.log("Data not fetched");
    }
}
displayDetails();
