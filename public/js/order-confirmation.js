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

const todayDate = document.querySelector(".today-date");
const newDate = new Date();

todayDate.innerText = `${newDate.getDate()}/${
    newDate.getMonth() + 1
}/${newDate.getFullYear()}`;
