var closeBtn = document.querySelector(".cart-close");
closeBtn.addEventListener("click", () => {
    // document.querySelector(".cart-modal").style.innerHTML = "";
    console.log("Button click");
    $(".cart-modal").empty();
    visible = "false";
});
