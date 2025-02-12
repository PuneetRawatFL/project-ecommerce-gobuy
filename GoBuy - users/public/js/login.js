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

const loginContainer = document.querySelector("#login-container");
const registerContainer = document.querySelector("#register-container");
//heading
const formHeading = document.querySelector(".form-heading");
//register here button
const registerHere = document.querySelector("#register-here");
registerHere.addEventListener("click", () => {
    formHeading.innerText = "Register";
    loginContainer.style.display = "none";
    // registerContainer.style.display = "block";
    registerContainer.style.display = "block";

    // Trigger reflow to ensure the transition starts
    registerContainer.offsetHeight; // Force reflow

    // Add the show class to start the transition
    registerContainer.classList.add("show");
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
                    console.log(result);

                    toastr.success(
                        `${result.message}`, //message
                        "Successful", //title
                        {
                            timeOut: 2000,
                            progressBar: true,
                        } //timeout
                    );
                    if (result.action === "register") {
                        setTimeout(() => {
                            window.location.href = "../html/login.html";
                        }, 2000);
                    } else {
                        // console.log("object");
                        // console.log(result.result.name);
                        window.userLoggedIn(result.result.name);
                        //acess token
                        document.cookie = `token = ${result.token}; path=/`;

                        setTimeout(() => {
                            window.location.href = "../html/products.html";
                        }, 2000);
                    }
                } else {
                    // alert("Form submission fai/led.");
                    const result = await res.json();
                    toastr.error(
                        `${result}`, //message
                        "", //title
                        {
                            timeOut: 2000,
                            progressBar: true,
                        } //timeout
                    );
                }
            })
            .catch((err) => console.log("Error:", err));
    });
});

//logout function
