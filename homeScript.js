//fetch header navbar
document.addEventListener("DOMContentLoaded", () => {
	fetch("header.html")
		.then((response) => response.text())
		.then((data) => {
			document.querySelector(".navbar").innerHTML = data;
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

// carousel scroll
const carousel = document.querySelector(".carousel");
const carouselItems = document.querySelectorAll(".carousel-item");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

let index = 0;
//carous
function showNext() {
	if (index < carouselItems.length - 4) {
		index++;
		console.log(carouselItems.length);
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

(function displayProductCard() {
	fetch("https://fakestoreapi.com/products")
		.then((res) => res.json())
		.then((data) => {
			console.log(data);

			productCard.forEach((product) => {
				var rand = Math.floor(Math.random() * 10);
				// console.log(rand);
				console.log(product.children[1].innerText);
				console.log(data[rand]);
				//to display image
				product.children[0].src = data[rand].image;
				//to display price
				// product.children[1].innerText = `$${data[rand].price}`;
				// product.children[0].src = data[rand].image;
			});
		});
})();

//fetch footer
document.addEventListener("DOMContentLoaded", () => {
	fetch("footer.html")
		.then((response) => response.text())
		.then((data) => {
			document.querySelector("footer").innerHTML = data;
		});
});
