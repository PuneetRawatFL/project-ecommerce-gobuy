const tbody = document.querySelector("tbody");
async function getUserList() {
    tbody.innerHTML = "";
    const response = await fetch(`
        http://localhost:8001/mysql?mysqlQuery=select * from users
        `);
    const result = await response.json();
    console.log(result);
    result.forEach((user) => {
        console.log(user);

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
        statustd.innerText = `${user.status}`;
        //button td
        const buttontd = document.createElement("td");
        buttontd.classList.add("button-container");
        //creating buttons - activate, deactivate, delete
        const resetBtn = document.createElement("button");
        resetBtn.innerText = "Reset Password";
        //reset password
        resetBtn.onclick = function () {
            resetModal.style.display = "block";
        };

        const actBtn = document.createElement("button");
        actBtn.innerText = "Activate";
        const deactBtn = document.createElement("button");
        deactBtn.innerText = "Deactivate";
        const delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        //delete user
        delBtn.addEventListener("click", async () => {
            console.log("delete user: ", user.userId);
            const response = await fetch(
                `http://localhost:8001/mysql?mysqlQuery=delete from users where userId = ${user.userId}`
            );
            const result = await response.json();
            console.log(result);
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
            if (res.ok) {
                const result = await res.json();

                resultDiv.style.display = "block";
                resultDiv.style.backgroundColor = "green";
                resultDiv.innerText = result.message;
                console.log(result.result.name);
            } else {
                // alert("Form submission failed.");
                const result = await res.json();
                resultDiv.style.display = "block";
                resultDiv.style.backgroundColor = "red";
                resultDiv.innerText = result;
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

    fetch("http://localhost:8001/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(async (res) => {
            const resultDiv = document.querySelector("#reset-result");
            // console.log(res);
            if (res.ok) {
                const result = await res.json();
                console.log(result);

                resultDiv.style.display = "block";
                resultDiv.style.backgroundColor = "green";
                resultDiv.innerText = result;
                // console.log(result.result.name);
            } else {
                // alert("Form submission failed.");
                const result = await res.json();
                resultDiv.style.display = "block";
                resultDiv.style.backgroundColor = "red";
                resultDiv.innerText = result;
            }
        })
        .catch((err) => console.log("Error:", err));
});

//reset password
