//loading header script
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

const submitBtn = document.querySelector("#submitBtn");
submitBtn.addEventListener("click", (event) => {
    const form = document.querySelector(".shipping-form");
    const formData = new FormData(form);

    form.reportValidity();

    // form.submit();
    if (form.checkValidity()) {
        // Prevent form submission
        event.preventDefault();
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch("http://localhost:8000/submit-shipping-details", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (res.ok) {
                    // If form submission is successful, redirect to the new page
                    window.location.href = "./confirm-details.html";
                } else {
                    alert("Form submission failed.");
                }
            })
            .catch((err) => console.log("Error:", err));
    } else {
        event.preventDefault(); // Prevent form submission
        // alert("Please fill in all required fields.");
    }
});
