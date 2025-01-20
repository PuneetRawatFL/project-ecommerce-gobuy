// fetch header navbar and navbar
document.addEventListener("DOMContentLoaded", () => {
    // fetch header
    fetch("header.html")
        .then((response) => {
            response.text();
        })
        .then((data) => {
            console.log(data);
        });

    //fetch footer
    // fetch("footer.html")
    //     .then((response) => response.text())
    //     .then((data) => {
    //         document.querySelector("footer").innerHTML = data;
    //     });

    //fetch announcement bar
    fetch("announcement-bar.html")
        .then((response) => response.text())
        .then((data) => {
            document.querySelector(".announcement-bar").innerHTML = data;
        });
});

var acc = document.getElementsByClassName("accordion");
var i;
for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}

//deals-slider-scroll
const deals = document.querySelector(".deals");
const dealsItems = document.querySelectorAll(".deal-item");
const prevBtnSlide = document.querySelector(".prev-btn-slide");
const nextBtnSlide = document.querySelector(".next-btn-slide");

let slideIndex = 0;
function showNextDeal() {
    if (slideIndex < dealsItems.length - 1) {
        slideIndex++;
    } else {
        slideIndex = 0;
    }
    deals.style.transform = `translateX(-${slideIndex * 100}%)`; // Adjust percentage based on items shown
}

function showPrevDeal() {
    if (slideIndex > 0) {
        slideIndex--;
        deals.style.transform = `translateX(-${slideIndex * 100}%)`; // Adjust percentage based on items shown
    }
}

//adding event listener to buttons
nextBtnSlide.addEventListener("click", showNextDeal);
prevBtnSlide.addEventListener("click", showPrevDeal);

setInterval(showNextDeal, 5000);

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

// function to display product images in carousel from api
const productCardImg = document.querySelector("#product-card-img");
const productCardName = document.querySelector("#product-card-name");
const productCardPrice = document.querySelector("#product-card-price");

var productCard = document.querySelectorAll(".product-card");

// function to get non-repeatitive random numbers;
function getRandomNumber() {
    let numbers = [];
    while (numbers.length < 10) {
        var rand = Math.floor(Math.random() * 10);
        if (!numbers.includes(rand)) {
            numbers.push(rand);
        }
    }
    return numbers;
}

(function displayProductCard() {
    fetch("http://localhost:8000/products")
        .then((res) => res.json())
        .then((data) => {
            let x = 0;
            let randArr = getRandomNumber();
            productCard.forEach((product) => {
                product.children[0].href = `product-page.html?id=${
                    data[randArr[x]].id
                }`;
                //to display image
                // product.children[0].children[0].src = data[randArr[x]].image;
                product.children[0].children[0].src = `http://localhost:8000/product-images/product_${
                    data[randArr[x]].id
                }.jpg`;
                //to display price
                product.children[1].innerText = `$${data[randArr[x]].price}`;
                x++;
            });
        });
})();

//loading header script
$(function () {
    $(".navbar").load("header.html", function () {
        $.getScript("header-script.js");
    });
});
