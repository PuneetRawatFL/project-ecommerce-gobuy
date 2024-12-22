//loading cart-modal
// let visible = "false";
// let scriptLoaded = "false";
$(function () {
	$(".cart-modal").load("cart.html");
	document.querySelector(".shopping-cart").addEventListener("click", () => {
		console.log(document.querySelector(".cart-modal"));
		// if (visible === "false") {
		// 	visible = "true";
		// 	$(".cart-modal").load("cart.html", function () {
		// 		//to load cart-script only one
		// 		// if (scriptLoaded === "false") {
		// 		// 	$.getScript("cart-script.js");
		// 		// 	scriptLoaded = "true";
		// 		// }
		// 		document.querySelector(".cart-close").addEventListener("click", () => {
		// 			if (visible === "true") {
		// 				$(".cart-modal").empty(); //empty cart modal
		// 				$(".cart-script.js").remove();
		// 				visible = "false";
		// 			}
		// 		});
		// 	});
		// }
	});
});
