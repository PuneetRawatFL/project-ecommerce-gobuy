const tbody = document.querySelector("tbody");
async function getUserList() {
    tbody.innerHTML = "";
    const response = await fetch(`
        http://localhost:8001/mysql?mysqlQuery=select * from users
        `);
    const result = await response.json();
    // console.log(result);
    result.forEach((user) => {
        // console.log(user);

        // tbody-> row-> td

        //creating row for each user
        const tr = document.createElement("tr");

        //creating td - id, name, email, date, actions
        //id
        const idtd = document.createElement("td");
        idtd.innerText = `${user.userId}`;
        //name
        const nametd = document.createElement("td");
        nametd.innerText = `${user.name}`;
        //email
        const emailtd = document.createElement("td");
        emailtd.innerText = `${user.email}`;
        //date
        const orderDateStr = `${user.created_on}`;
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
        //stauts
        const statustd = document.createElement("td");
        statustd.innerText = `${user.user_status}`;
        if (user.user_status === "active") {
            statustd.style.color = "green";
        }
        if (user.user_status === "inactive") {
            statustd.style.color = "red";
        }
        //button td
        const buttontd = document.createElement("td");
        buttontd.classList.add("button-container");
        //creating buttons - activate, deactivate, delete
        const resetBtn = document.createElement("button");
        resetBtn.innerText = "Reset Password";
        //add user id
        //reset password
        resetBtn.onclick = function () {
            resetModal.style.display = "block";
            const changePassUserId =
                document.querySelector("#changePassUserId");
            changePassUserId.innerText = user.userId;
        };

        const actBtn = document.createElement("button");
        actBtn.innerText = "Activate";
        actBtn.addEventListener("click", async () => {
            // console.log("activate: ", user.userId);
            const response = await fetch(
                `http://localhost:8001/mysql?mysqlQuery=update users set user_status = 'active' where userId = ${user.userId}`
            );
            const result = await response.json();
            // console.log(result.affectedRows);
            if (result.affectedRows === 1) {
                toastr.success(
                    `User ${user.userId} activated successfully.`, //message
                    "", //title
                    {
                        timeOut: 2000,
                        progressBar: true,
                    } //timeout
                );
            }
            getUserList();
        });
        const deactBtn = document.createElement("button");
        deactBtn.innerText = "Deactivate";
        deactBtn.addEventListener("click", async () => {
            // console.log("activate: ", user.userId);
            const response = await fetch(
                `http://localhost:8001/mysql?mysqlQuery=update users set user_status = 'inactive' where userId = ${user.userId}`
            );
            const result = await response.json();
            // console.log(result.affectedRows);
            if (result.affectedRows === 1) {
                toastr.success(
                    `User ${user.userId} deactivated successfully.`,
                    "",
                    {
                        timeOut: 2000,
                        progressBar: true,
                    } //timeout
                );
            }
            getUserList();
        });
        const delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        //delete user
        delBtn.addEventListener("click", async () => {
            console.log("delete user: ", user.userId);
            const response = await fetch(
                `http://localhost:8001/mysql?mysqlQuery=delete from users where userId = ${user.userId}`
            );
            const result = await response.json();
            if (result.affectedRows === 1) {
                toastr.success(
                    `User ${user.userId} deleted successfully.`, //message
                    // "Login Successfull", //title
                    {
                        timeOut: 2000,
                        closeButton: true,
                        progressBar: true,
                    } //timeout
                );
            }
            getUserList();
        });

        //appending buttons to container
        buttontd.append(resetBtn);
        buttontd.append(actBtn);
        buttontd.append(deactBtn);
        buttontd.append(delBtn);

        //appending td to row
        tr.append(idtd);
        tr.append(nametd);
        tr.append(emailtd);
        tr.append(datetd);
        tr.append(statustd);
        tr.append(buttontd);

        //appeding row to body
        tbody.append(tr);
    });
}
getUserList();

// add user model
var userModal = document.getElementById("addUserModal");
var addUserBtn = document.getElementById("addUserBtn");
var closeSpan = document.getElementById("closeSpan");

addUserBtn.onclick = function () {
    userModal.style.display = "block";
};

closeSpan.onclick = function () {
    userModal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == userModal) {
        userModal.style.display = "none";
    }
};
//result div
const resultDiv = document.querySelector(".result-container");
//add user form
const form = document.querySelector("#form");
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    fetch("http://localhost:8001/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(async (res) => {
            console.log(res);
            const result = await res.json();
            if (res.ok) {
                toastr.success(
                    `${result}`, //message
                    "", //title
                    {
                        timeOut: 2000,
                        progressBar: true,
                    } //timeout
                );

                setTimeout(() => {
                    window.location.href = "../html/manage-users.html";
                }, 2000);
            } else {
                // alert("Form submission failed.");
                toastr.error(
                    `${result}`, //message
                    "Error registering", //title
                    {
                        timeOut: 2000,
                        progressBar: true,
                    } //timeout
                );
            }
        })
        .catch((err) => console.log("Error:", err));
});

// reset password model
var resetModal = document.getElementById("resetModal");
var submitPasswordBtn = document.getElementById("submitPasswordBtn");
var closePasswordSpan = document.getElementById("closePasswordSpan");

closePasswordSpan.onclick = function () {
    resetModal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == resetModal) {
        userModal.style.display = "none";
    }
};

//reset password form
const passwordFrom = document.querySelector("#passwordFrom");
passwordFrom.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });
    data["userId"] = changePassUserId.innerText;

    fetch("http://localhost:8001/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(async (res) => {
            // console.log(res);
            const result = await res.json();
            if (res.ok) {
                toastr.success(
                    `${result}`, //message
                    "", //title
                    {
                        timeOut: 2000,
                        progressBar: true,
                    } //timeout
                );

                setTimeout(() => {
                    window.location.href = "../html/manage-users.html";
                }, 2000);
            } else {
                console.log(result);
                toastr.error(
                    `${result}`, //message
                    "Error", //title
                    {
                        timeOut: 2000,
                        progressBar: true,
                    } //timeout
                );
            }
        })
        .catch((err) => console.log("Error:", err));
});
