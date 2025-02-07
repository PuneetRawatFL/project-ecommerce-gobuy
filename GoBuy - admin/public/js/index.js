$(function () {
    $(".navbar").load("header.html", function () {
        $.getScript("../js/header.js");
    });
    $("#footer").load("footer.html");
});
//result
const resultDiv = document.querySelector(".result-container");

//form
const form = document.querySelector("#form");
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    fetch("http://localhost:8001/admin-login", {
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

                resultDiv.style.display = "block";
                resultDiv.style.backgroundColor = "green";
                resultDiv.innerText = result.message;
                console.log(result.result.name);
                window.userLoggedIn(result.result.name);

                // acess token
                document.cookie = `token = ${result.token}; path=/`;
                console.log(document.cookie);

                setTimeout(() => {
                    window.location.href = "../html/admin-homepage.html";
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
