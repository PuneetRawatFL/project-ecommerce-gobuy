// fetching header, footer and announcement bar
//loading header script
$(function () {
  //announcement bar
  $(".announcement-bar").load("announcement-bar.html");
  //header
  $(".navbar").load("header.html", function () {
    $.getScript("header-script.js");
  });
  //footer
  $("#footer").load("footer.html");
});
