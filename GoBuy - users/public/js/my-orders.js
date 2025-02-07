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
    // console.log(user[2]);
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
        orderHeading.classList.add("order-heading");

        const orderIdTag = document.createElement("h3");
        orderIdTag.innerText = `Order id: ${order.order_id}`;

        //formatting date
        const orderDateStr = `${order.order_date}`;
        const orderDateObj = new Date(orderDateStr);
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            // hour: "2-digit",
            // minute: "2-digit",
            // second: "2-digit",
        };
        const formattedDate = orderDateObj.toLocaleString("en-US", options);
        console.log(formattedDate);

        const orderDateTag = document.createElement("p");
        orderDateTag.innerText = `Placed on: ${formattedDate}`;
        orderDateTag.style.fontSize = "0.8rem";

        orderHeading.append(orderIdTag);
        orderHeading.append(orderDateTag);
        //appeding
        orderContainer.append(orderHeading);

        //detail container
        const displayArea = document.createElement("div");
        displayArea.style.display = "flex";
        displayArea.style.gap = "10px";
        //img div
        const orderItemImage = document.createElement("div");
        orderItemImage.classList.add("order-item-image");
        //image tag
        const imagTag = document.createElement("img");
        imagTag.src = `http://localhost:8000/product-images/product_${order.id}.jpg`;
        //appending
        orderItemImage.append(imagTag);

        //title, price div
        const orderTitleDiv = document.createElement("div");
        const orderTitle = document.createElement("p");
        orderTitle.innerText = `${order.title}`;

        orderTitleDiv.append(orderTitle);

        //append image
        displayArea.append(orderItemImage);
        //append title
        displayArea.append(orderTitleDiv);

        //
        orderContainer.append(displayArea);
        //appending
        orderItemArea.append(orderContainer);
    });
}
getMyOrders();
