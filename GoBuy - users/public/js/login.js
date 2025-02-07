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

const loginContainer = document.querySelector("#login-container");
const registerContainer = document.querySelector("#register-container");
//heading
const formHeading = document.querySelector(".form-heading");
//register here button
const registerHere = document.querySelector("#register-here");
registerHere.addEventListener("click", () => {
    formHeading.innerText = "Register";
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
});

//login here button
const loginHere = document.querySelector("#login-here");
loginHere.addEventListener("click", () => {
    formHeading.innerText = "Login";
    loginContainer.style.display = "block";
    registerContainer.style.display = "none";
});

//result
const resultDiv = document.querySelector(".result-container");
//gather form
const forms = document.querySelectorAll("#form");
forms.forEach((form) => {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch("http://localhost:8000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(async (res) => {
                console.log(res);
                if (res.ok) {
                    const result = await res.json();
                    // console.log(result);

                    resultDiv.style.display = "block";
                    resultDiv.style.backgroundColor = "green";
                    resultDiv.innerText = result.message;
                    console.log(result.result.name);
                    window.userLoggedIn(result.result.name);

                    //acess token
                    document.cookie = `token = ${result.token}; path=/`;
                    // console.log(document.cookie);

                    setTimeout(() => {
                        window.location.href = "../html/my-orders.html";
                    }, 2000);
                } else {
                    // alert("Form submission failed.");
                    const result = await res.json();
                    resultDiv.style.display = "block";
                    resultDiv.style.backgroundColor = "red";
                    resultDiv.innerText = result;
                }
            })
            .catch((err) => console.log("Error:", err));
    });
});

//logout function
