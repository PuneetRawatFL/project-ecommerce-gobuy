$(function () {
    $(".navbar").load("header.html", function () {
        $.getScript("../js/header.js");
    });
    $("#footer").load("footer.html");
});
//result

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

                $(function () {
                    // toastr.success("success message");
                    toastr.success(
                        `${result.message}`, //message
                        "Login Successfull", //title
                        {
                            timeOut: 2000,
                            progressBar: true,
                        } //timeout
                    );
                });

                // acess token
                document.cookie = `adminToken = ${result.token}; path=/`;
                console.log(document.cookie);

                setTimeout(() => {
                    window.location.href = "../html/admin-homepage.html";
                }, 2000);
            } else {
                const result = await res.json();
                // alert("Form submission failed.");
                $(function () {
                    toastr.error(
                        `${result}`,
                        "Error Loggin In",
                        {
                            timeOut: 2000,
                            progressBar: true,
                        } //timeout
                    );
                });
            }
        })
        .catch((err) => console.log("Error:", err));
});
