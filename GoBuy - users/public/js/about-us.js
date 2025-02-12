// fetching header, footer and announcement bar
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

// carousel scroll
const carousel = document.querySelector(".carousel");
const carouselItems = document.querySelectorAll(".carousel-item");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

let index = 0;
//carousal click
function showNext() {
    if (index < carouselItems.length - 4) {
        index++;
        carousel.style.transform = `translateX(-${index * 25}%)`; // Adjust percentage based on items shown
    }
}

function showPrev() {
    if (index > 0) {
        index--;
        carousel.style.transform = `translateX(-${index * 25}%)`; // Adjust percentage based on items shown
    }
}

nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrev);
