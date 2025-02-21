const prodTable = document.querySelector("#products-table");
async function getProductList() {
    const response = await fetch(`http://localhost:8001/products`);
    const result = await response.json();

    result.forEach(async (product) => {
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

        //image - 1
        const imgDiv1 = document.createElement("div");
        imgDiv1.style.display = "flex";
        imgDiv1.style.flexDirection = "column";
        imgDiv1.style.gap = "10px";

        const div1 = document.createElement("div");
        div1.style.display = "flex";
        div1.style.gap = "10px";

        //radio tag
        const radioTag1 = document.createElement("input");
        radioTag1.type = "radio";
        radioTag1.name = `active-image-${product.id}`;
        //    if (image1.image_status === "active") {
        //        radioTag1.checked = true;
        //    }

        div1.append(radioTag1);

        const response = await fetch(
            `http://localhost:8001/mysql?mysqlQuery= select * from product_images where product_id = ${product.id} limit 0,1`
        );
        const result = await response.json();
        // console.log(result);
        // console.log(result.length);
        // console.log(result[0].product_image);
        const img1 = document.createElement("img");
        img1.id = result[0].product_image;
        img1.src = `http://localhost:8001/uploads/${result[0].product_image}`;
        img1.classList.add("product-image");
        div1.append(img1);

        // console.log(img1.id);
        // if (result[0].image_status === "active") {
        //     radioTag1.checked = true;
        // }

        radioTag1.addEventListener("change", async () => {
            // console.log("tag 1", radioTag1.checked);
            // console.log(img1.id);

            const response = await fetch(
                `http://localhost:8001/mysql?mysqlQuery= update products set product_image = '${img1.id}' where id = ${product.id}; `
            );
            const result = await response.json();
            console.log(result);
        });

        //appending
        imgDiv1.append(div1);
        // console.log(imgDiv1.children[0].children);
        // console.log(imgDiv1.children[0].children[1]);
        // const getImage = document.querySelector("#active");
        // console.log(getImage);

        //second image
        const imgDiv2 = document.createElement("div");
        imgDiv2.style.display = "flex";
        imgDiv2.style.flexDirection = "column";
        imgDiv2.style.gap = "10px";

        const div2 = document.createElement("div");
        div2.style.display = "flex";
        div2.style.gap = "10px";

        const response2 = await fetch(
            `http://localhost:8001/mysql?mysqlQuery= select * from product_images where product_id = ${product.id} limit 1,1`
        );
        const result2 = await response2.json();

        if (result2.length > 0) {
            //radio tag
            const radioTag2 = document.createElement("input");
            radioTag2.type = "radio";
            radioTag2.name = `active-image-${product.id}`;
            //    if (image1.image_status === "active") {
            //        radioTag1.checked = true;
            //    }

            div2.append(radioTag2);

            const img2 = document.createElement("img");
            img2.id = result2[0].product_image;
            img2.src = `http://localhost:8001/uploads/${result2[0].product_image}`;
            img2.classList.add("product-image");
            div2.append(img2);

            radioTag2.addEventListener("change", async () => {
                // console.log("tag 2", radioTag2.checked);
                // console.log(img2.id);

                const response = await fetch(
                    `http://localhost:8001/mysql?mysqlQuery= update products set product_image = '${img2.id}' where id = ${product.id}`
                );
            });

            //appending
            imgDiv2.append(div2);
        }

        imgtd.append(imgDiv1);
        imgtd.append(imgDiv2);

        const skutd = document.createElement("td");
        skutd.innerText = `${product.sku}`;

        //actions container
        const actionstd = document.createElement("td");
        const btnDiv = document.createElement("div");
        btnDiv.style.display = "flex";
        btnDiv.style.justifyContent = "center";
        btnDiv.style.alignItems = "center";
        btnDiv.style.gap = "15px";

        const editImg = document.createElement("img");
        editImg.style.height = "20px";
        editImg.style.width = "20px";
        editImg.style.cursor = "pointer";
        editImg.src = "../images/edit.png";
        editImg.addEventListener("click", () => {
            window.location.href = `edit-product.html?id=${product.id}`;
        });

        const delImg = document.createElement("img");
        delImg.style.height = "20px";
        delImg.style.width = "20px";
        delImg.style.cursor = "pointer";
        delImg.src = "../images/delete.png";
        delImg.addEventListener("click", () => {
            console.log(product.id);
            document.querySelector("#deleteProduct").style.display = "block";
            document.querySelector("#product-id").innerText = `${product.id}`;

            //yes button
            const yesBtn = document.querySelector("#yes-delete");
            yesBtn.addEventListener("click", () => {
                // console.log(product.id);
                fetch(`http://localhost:8001/delete-product/${product.id}`)
                    .then((response) => response.json())
                    .then((result) => {
                        console.log(result);
                        if ((result.message = "success")) {
                            toastr.success(
                                "Product deleted successfully.", //message
                                "", //title
                                {
                                    timeOut: 2000,
                                    progressBar: true,
                                } //timeout
                            );

                            setTimeout(() => {
                                window.location.href =
                                    "../html/manage-products.html";
                            }, 2000);
                        } else {
                            toastr.error(
                                "Error deleting product.", //message
                                "", //title
                                {
                                    timeOut: 2000,
                                    progressBar: true,
                                } //timeout
                            );
                        }
                    });
            });
        });

        btnDiv.append(editImg);
        btnDiv.append(delImg);
        actionstd.append(btnDiv);

        tr.append(idtd);
        tr.append(titletd);
        tr.append(pricetd);
        tr.append(descriptiontd);
        tr.append(categorytd);
        tr.append(ratetd);
        tr.append(counttd);
        tr.append(imgtd);
        tr.append(skutd);
        tr.append(actionstd);
        // tr.append(skutd);

        prodTable.append(tr);
    });
}
getProductList();

//confirm delete product
var deleteModal = document.getElementById("deleteProduct");
var closeDeleteModal = document.getElementById("close-delete-product");

closeDeleteModal.onclick = function () {
    deleteModal.style.display = "none";
};
