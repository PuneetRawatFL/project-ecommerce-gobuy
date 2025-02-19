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

        const imgDiv1 = document.createElement("div");
        imgDiv1.style.display = "flex";
        imgDiv1.style.flexDirection = "column";
        imgDiv1.style.gap = "10px";

        //fetching images
        fetch(`http://localhost:8001/get-image/${product.id}`)
            .then((response) => response.json())
            .then((result) => {
                result.forEach((image) => {
                    // console.log(image.image_status);
                    //creating div
                    const div = document.createElement("div");
                    div.style.display = "flex";
                    div.style.gap = "10px";

                    //radio tag
                    const radioTag = document.createElement("input");
                    radioTag.type = "radio";
                    radioTag.name = `active-image-${product.id}`;
                    if (image.image_status === "active") {
                        radioTag.checked = true;
                    }

                    //image tag
                    const img = document.createElement("img");
                    img.src = image.product_image;
                    img.classList.add("product-image");

                    //appending
                    div.append(radioTag);
                    div.append(img);
                    imgDiv1.append(div);
                });
            });

        imgtd.append(imgDiv1);

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
