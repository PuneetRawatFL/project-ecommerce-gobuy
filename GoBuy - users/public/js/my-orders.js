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

// query for the selected user orders``

// select * from products p join order_items ot on ot.product_id = p.id join orders on ot.order_id = orders.order_id join users u on u.userId = orders.user_id where u.userId = 2

const orderItemArea = document.querySelector(".order-items-area");

async function getMyOrders() {
    const user = document.cookie.match(/(^| )userId=([^;]+)/);
    const userId = parseInt(user[2], 10);

    const response =
        await fetch(`http://localhost:8000/mysql?mysqlQuery=select * from products p join order_items ot on ot.product_id = p.id join orders on ot.order_id = orders.order_id join users u on u.userId = orders.user_id where u.userId = ${userId}
`);
    const result = await response.json();
    // console.log(result);

    result.forEach((order) => {
        console.log(order);

        //container for each order
        const orderContainer = document.createElement("div");
        orderContainer.classList.add("order-container");

        //heading tag
        const orderHeading = document.createElement("div");

        const orderIdTag = document.createElement("h3");
        orderIdTag.innerText = `Order id: ${order.order_id}`;

        //formatting date
        const orderDateStr = `${order.order_date}`;
        const orderDateObj = new Date(orderDateStr);
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        };
        const formattedDate = orderDateObj.toLocaleString("en-US", options);
        console.log(formattedDate);

        const orderDateTag = document.createElement("p");
        orderDateTag.innerText = `Placed on: ${formattedDate}`;

        orderHeading.append(orderIdTag);
        orderHeading.append(orderDateTag);
        //appeding
        orderContainer.append(orderHeading);

        //appending
        orderItemArea.append(orderContainer);
    });
}
getMyOrders();
