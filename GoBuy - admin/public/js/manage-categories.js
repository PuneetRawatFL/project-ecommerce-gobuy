const catTable = document.querySelector("#category-table");
//fetch categories
async function getCategoryList() {
    catTable.innerHTML = "";
    const response = await fetch(
        `http://localhost:8001/mysql?mysqlQuery=select * from categories`
    );
    const result = await response.json();

    result.forEach((category) => {
        // console.log(product);

        //creating row
        const tr = document.createElement("tr");

        //creating td - id, name, status
        const idtd = document.createElement("td");
        idtd.innerText = `${category.cat_id}`;

        const titletd = document.createElement("td");
        titletd.innerText = `${category.cat_name}`;

        const statustd = document.createElement("td");
        statustd.innerText = `${category.cat_status}`;
        if (category.cat_status === "active") statustd.style.color = "green";
        if (category.cat_status === "inactive") statustd.style.color = "red";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `cat${category.cat_id}`;
        checkbox.name = `cat${category.cat_id}`;
        checkbox.value = `cat${category.cat_name}`;
        if (category.cat_status === "active") {
            checkbox.checked = true; // Set checkbox to be already checked
        }
        checkbox.addEventListener("change", async function () {
            if (this.checked) {
                console.log("Checkbox is checked.");
                const response = await fetch(
                    `http://localhost:8001/mysql?mysqlQuery=update categories set cat_status = 'active' where cat_id = ${category.cat_id}`
                );
                getCategoryList();
            } else {
                console.log("Checkbox is unchecked.");
                const response = await fetch(
                    `http://localhost:8001/mysql?mysqlQuery=update categories set cat_status = 'inactive' where cat_id = ${category.cat_id}`
                );
                getCategoryList();
            }
        });

        const checkContainer = document.createElement("td");
        checkContainer.style.textAlign = "center";

        checkContainer.append(checkbox);

        tr.append(idtd);
        tr.append(titletd);
        tr.append(statustd);
        tr.append(checkContainer);

        catTable.append(tr);
    });
}
getCategoryList();
