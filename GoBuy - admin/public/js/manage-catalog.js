const prodTable = document.querySelector("#products-table");
async function getProductList() {
    const response = await fetch(
        `http://localhost:8001/mysql?mysqlQuery=select * from products`
    );
    const result = await response.json();

    result.forEach((product) => {
        // console.log(product);

        //creating row
        const tr = document.createElement("tr");

        //creating td - id, title, price, description, category, rating rate, rating count, sku
        const idtd = document.createElement("td");
        idtd.innerText = `${product.id}`;

        const titletd = document.createElement("td");
        titletd.innerText = `${product.title}`;

        const pricetd = document.createElement("td");
        pricetd.innerText = `$${product.price}`;

        const descriptiontd = document.createElement("td");
        descriptiontd.innerText = `${product.description}`;

        const categorytd = document.createElement("td");
        categorytd.innerText = `${product.category}`;

        const ratetd = document.createElement("td");
        ratetd.innerText = `${product.rating_rate}`;

        const counttd = document.createElement("td");
        counttd.innerText = `${product.rating_count}`;

        const imgtd = document.createElement("td");
        imgtd.style.display = "flex";
        imgtd.style.flexDirection = "column";
        imgtd.style.gap = "10px";

        const imgDiv1 = document.createElement("div");
        imgDiv1.style.display = "flex";
        imgDiv1.style.gap = "10px";

        const radioTag = document.createElement("input");
        radioTag.type = "radio";
        radioTag.name = `active-image-${product.id}`;
        if (product.prod_image_id === "1") {
            radioTag.checked = true;
        }
        radioTag.addEventListener("change", async function () {
            const response = await fetch(
                `http://localhost:8001/mysql?mysqlQuery=update products set prod_image_id = 1 where id = ${product.id}`
            );
        });

        const prodImg = document.createElement("img");
        prodImg.src = `http://localhost:8001/product-images/product_${product.id}-1.jpg`;
        // console.log(prodImg.src);
        prodImg.classList.add("product-image");

        const imgDiv2 = document.createElement("div");
        imgDiv2.style.display = "flex";
        imgDiv2.style.gap = "10px";

        const radioTag2 = document.createElement("input");
        radioTag2.type = "radio";
        radioTag2.name = `active-image-${product.id}`;
        if (product.prod_image_id == "2") {
            radioTag2.checked = true;
        }
        radioTag2.addEventListener("change", async function () {
            const response = await fetch(
                `http://localhost:8001/mysql?mysqlQuery=update products set prod_image_id = 2 where id = ${product.id}`
            );
        });

        const prodImg2 = document.createElement("img");
        prodImg2.src = `http://localhost:8001/product-images/product_${product.id}-2.jpg`;
        // console.log(prodImg2.src);
        prodImg2.classList.add("product-image");

        //img 1
        imgDiv1.append(radioTag);
        imgDiv1.append(prodImg);
        //img2
        imgDiv2.append(radioTag2);
        imgDiv2.append(prodImg2);
        //appending to td
        imgtd.append(imgDiv1);
        imgtd.append(imgDiv2);

        const skutd = document.createElement("td");
        skutd.innerText = `${product.sku}`;

        tr.append(idtd);
        tr.append(titletd);
        tr.append(pricetd);
        tr.append(descriptiontd);
        tr.append(categorytd);
        tr.append(ratetd);
        tr.append(counttd);
        tr.append(imgtd);
        tr.append(skutd);
        // tr.append(skutd);

        prodTable.append(tr);
    });
}
getProductList();

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
