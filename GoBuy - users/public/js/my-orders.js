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

// query for the selected user orders``

// select * from products p join order_items ot on ot.product_id = p.id join orders on ot.order_id = orders.order_id join users u on u.userId = orders.user_id where u.userId = 2

const orderItemArea = document.querySelector(".order-items-area");

async function getMyOrders() {
    const user = document.cookie.match(/(^| )userId=([^;]+)/);
    // console.log(user[2]);
    if (user) {
        const userId = parseInt(user[2], 10);

        const response =
            await fetch(`http://localhost:8000/mysql?mysqlQuery=select * from products p join order_items ot on ot.product_id = p.id join orders on ot.order_id = orders.order_id join users u on u.userId = orders.user_id join addresses a on u.userId = a.userId where u.userId = ${userId}
        `);
        const result = await response.json();
        // console.log(result);

        result.forEach((order) => {
            // console.log(order);

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
            // console.log(formattedDate);

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
            displayArea.style.marginTop = "10px";
            // displayArea.style.justifyContent = "space-between";
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
            orderTitle.classList.add("highlight");
            orderTitle.innerText = `${order.title}`;
            orderTitleDiv.append(orderTitle);

            // const quantityDiv = document.createElement("div");
            const quantityTag = document.createElement("p");
            quantityTag.innerText = `Quantity: ${order.quantity}`;
            orderTitleDiv.append(quantityTag);

            const priceTag = document.createElement("p");
            priceTag.innerText = `Price: $${order.total_price}`;
            orderTitleDiv.append(priceTag);

            const shippingTag = document.createElement("p");
            shippingTag.innerText = `Shipping Address: ${order.address}`;
            orderTitleDiv.append(shippingTag);

            const orderStatusTag = document.createElement("p");
            if (order.order_status === "pending") {
                orderStatusTag.innerText = `Your order will be shipped soon!`;
            }
            if (order.order_status === "shipped") {
                orderStatusTag.innerText = `Your order has been shipped!`;
            }
            if (order.order_status === "complete") {
                orderStatusTag.innerText = `Your order has been delievered`;
            }
            orderTitleDiv.append(orderStatusTag);

            const orderTotalDiv = document.createElement("div");
            const ordreTotalTag = document.createElement("p");
            ordreTotalTag.classList.add("highlight");
            orderTotalDiv.style.display = "flex";
            orderTotalDiv.style.justifyContent = "flex-end";
            orderTotalDiv.style.width = "500px";
            ordreTotalTag.innerText = ` Order Total - $${order.total_amount}`;
            orderTotalDiv.append(ordreTotalTag);

            //append image
            displayArea.append(orderItemImage);
            //append title
            displayArea.append(orderTitleDiv);
            //order total
            displayArea.append(orderTotalDiv);

            //
            orderContainer.append(displayArea);
            //appending
            orderItemArea.append(orderContainer);
        });
    }
}
getMyOrders();
