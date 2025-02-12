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

// function to add loading animaton to submit button
function addToCartLoading() {
    const btn = document.getElementById("submitFeedbackBtn");
    btn.classList.add("addButtonLoadingExtra");
    btn.style.backgroundColor = "#36558f";

    btn.innerText = "";

    const loadingdiv = document.createElement("div");
    loadingdiv.classList.add("addButtonLoading");
    //
    btn.appendChild(loadingdiv);
}

function removeAddButtonLoading() {
    const btn = document.getElementById("submitFeedbackBtn");
    btn.classList.remove("addButtonLoadingExtra");
    btn.style.backgroundColor = "#36558f";
    btn.innerHTML = "";
    btn.textContent = "Submit Message";
}

const contactForm = document.querySelector("#contactForm");

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addToCartLoading();

    const formData = new FormData(this);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    // console.log("before");

    fetch("http://localhost:8000/sendemail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => {
            if (res.ok) {
                removeAddButtonLoading();
                // console.log("form submitted");
                alert("feedback submitted successfully");
            } else {
                alert("Form submission failed.");
            }
        })
        .catch((err) => console.log("Error:", err));
    // console.log("after");
    // .then((res) => {
    //     res.json();
    //     console.log("hello");
    // })
    // .then((result) => {
    //     console.log("result");
    // })
    // .catch((err) => console.error(err));
});
