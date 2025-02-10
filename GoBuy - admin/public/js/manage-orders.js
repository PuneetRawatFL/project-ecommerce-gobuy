const tbody = document.querySelector("tbody");
async function getOrderList() {
    tbody.innerHTML = "";
    const response = await fetch(`
        http://localhost:8001/mysql?mysqlQuery=select * from orders
        `);
    const result = await response.json();
    // console.log(result);
    result.forEach((order) => {
        // console.log(order);

        // tbody-> row-> td

        //creating row for each order
        const tr = document.createElement("tr");

        //creating td - id, name, email, date, actions

        //id
        const idtd = document.createElement("td");
        idtd.innerText = `${order.order_id}`;

        //name
        const usertd = document.createElement("td");
        usertd.innerText = `${order.user_id}`;

        //date
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
        const datetd = document.createElement("td");
        datetd.innerText = `${formattedDate}`;

        //total amount
        const amounttd = document.createElement("td");
        amounttd.innerText = `$${order.total_amount}`;

        //stauts
        const statustd = document.createElement("td");
        statustd.innerText = `${order.order_status}`;
        if (order.order_status === "complete") {
            statustd.style.backgroundColor = "green";
            statustd.style.color = "white";
        }
        if (order.order_status === "pending") {
            statustd.style.backgroundColor = "red";
        }
        if (order.order_status === "shipped") {
            statustd.style.backgroundColor = "orange";
        }

        //button td
        const buttontd = document.createElement("td");
        buttontd.classList.add("button-container");
        //creating buttons - activate, deactivate, delete
        const pendingBtn = document.createElement("button");
        pendingBtn.innerText = "Pending";
        pendingBtn.addEventListener("click", async () => {
            console.log("activate: ", order.orderId);
            const response = await fetch(
                `http://localhost:8001/mysql?mysqlQuery=update orders set order_status = 'pending' where order_id = ${order.order_id}`
            );
            const result = await response.json();
            console.log(result);
            getOrderList();
        });

        const shippedBtn = document.createElement("button");
        shippedBtn.innerText = "Shipped";
        shippedBtn.addEventListener("click", async () => {
            console.log("activate: ", order.orderId);
            const response = await fetch(
                `http://localhost:8001/mysql?mysqlQuery=update orders set order_status = 'shipped' where order_id = ${order.order_id}`
            );
            const result = await response.json();
            console.log(result);
            getOrderList();
        });
        const completeBtn = document.createElement("button");
        completeBtn.innerText = "Complete";
        completeBtn.addEventListener("click", async () => {
            console.log("activate: ", order.orderId);
            const response = await fetch(
                `http://localhost:8001/mysql?mysqlQuery=update orders set order_status = 'complete' where order_id = ${order.order_id}`
            );
            const result = await response.json();
            console.log(result);
            getOrderList();
        });
        //appending buttons to container
        buttontd.append(pendingBtn);
        buttontd.append(shippedBtn);
        buttontd.append(completeBtn);

        const deltd = document.createElement("td");
        deltd.classList.add("del-button-container");

        const delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        //delete order
        delBtn.addEventListener("click", async () => {
            console.log("delete order: ", order.order_id);
            const queries = `
            delete from orders where order_id = ${order.order_id};
            delete from order_items where order_id = ${order.order_id};
            `;
            const encodedQueries = encodeURIComponent(queries);
            // `http://localhost:8001/mysql?mysqlQuery=delete from orders where order_id = ${order.order_id}`
            const response = await fetch(
                `http://localhost:8001/mysql?mysqlQuery=${encodedQueries}`
            );
            const result = await response.json();
            console.log(result);
            getOrderList();
        });

        deltd.append(delBtn);

        //appending td to row
        tr.append(idtd);
        tr.append(usertd);
        tr.append(datetd);
        tr.append(amounttd);
        tr.append(statustd);
        tr.append(buttontd);
        tr.append(deltd);

        //appeding row to body
        tbody.append(tr);
    });
}
getOrderList();
