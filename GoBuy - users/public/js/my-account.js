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

const user = document.cookie.match(/(^| )userId=([^;]+)/);
const userId = parseInt(user[2], 10);
async function displayDetails() {
    const response = await fetch(
        `http://localhost:8000/mysql?mysqlQuery=select * from users where userId = ${userId}`
    );

    if (response.ok) {
        const data = await response.json();
        // console.log("user data", data[0]);

        const orderDateStr = `${data[0].created_on}`;
        const orderDateObj = new Date(orderDateStr);
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            // hour: "2-digit",
            // minute: "2-digit",
            // second: "2-digit",
        };
        const formattedDate = orderDateObj.toLocaleString("en-US", options);
        // console.log(formattedDate);

        const userName = document.querySelector("#userName");
        const userEmail = document.querySelector("#userEmail");
        const userCreated = document.querySelector("#userCreated");
        const userGender = document.querySelector("#userGender");
        const userIcon = document.querySelector("#user-icon");

        userName.innerText = data[0].name;
        userEmail.innerText = data[0].email;
        userGender.innerText = data[0].gender;
        userCreated.innerText = formattedDate;

        if (data[0].gender == "male") {
            userIcon.src = "../images/male-icon.png";
        }
        if (data[0].gender == "female") {
            userIcon.src = "../images/female-icon.png";
        }
    } else {
        console.log("Data not fetched");
    }
}
displayDetails();

// add user model
var editModal = document.getElementById("edit-user");
var editBtn = document.getElementById("edit-btn");
var closeSpan = document.getElementById("closeSpan");

editBtn.onclick = function () {
    editModal.style.display = "block";
    fetch(
        `http://localhost:8000/mysql?mysqlQuery=select * from users where userId = ${userId}`
    )
        .then((res) => res.json())
        .then((data) => {
            console.log(data);

            const name = document.querySelector("#name");
            name.value = data[0].name;
            const email = document.querySelector("#email");
            email.value = data[0].email;
            const gender = document.querySelector("#gender");
            gender.value = data[0].gender;
        });
};

closeSpan.onclick = function () {
    editModal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == editModal) {
        editModal.style.display = "none";
    }
};
const submitBtn = document.querySelector("#submitBtn");
submitBtn.addEventListener("click", () => {
    event.preventDefault();

    const form = document.querySelector("#edit-form");
    const formData = new FormData(form);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    data["userId"] = userId;

    fetch(`http://localhost:8000/edit-user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((result) => {
            // console.log(result);

            if ((result.message = "success")) {
                toastr.success(
                    "", //message
                    "User updated successfully", //title
                    {
                        timeOut: 2000,
                        progressBar: true,
                    } //timeout
                );
                setTimeout(() => {
                    window.location.href = "my-account.html";
                }, 2000);
            } else {
                toastr.error(
                    "", //message
                    "Error updating product", //title
                    {
                        timeOut: 2000,
                        progressBar: true,
                    } //timeout
                );
            }
        });
});
