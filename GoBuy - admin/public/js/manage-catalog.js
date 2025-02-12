const tbody = document.querySelector("tbody");
async function getProductList() {
    const response = await fetch(
        `http://localhost:8001/mysql?mysqlQuery=select * from products`
    );
    const result = await response.json();

    result.forEach((product) => {
        console.log(product);

        //creating row
        const tr = document.createElement("tr");

        //creating td - id, title, price, description, category, rating rate, rating count, sku
        const idtd = document.createElement("td");
        idtd.innerText = `${product.id}`;

        const titletd = document.createElement("td");
        titletd.innerText = `${product.title}`;

        const pricetd = document.createElement("td");
        pricetd.innerText = `${product.price}`;

        const descriptiontd = document.createElement("td");
        descriptiontd.innerText = `${product.description}`;

        const categorytd = document.createElement("td");
        categorytd.innerText = `${product.category}`;

        const ratetd = document.createElement("td");
        ratetd.innerText = `${product.rating_rate}`;

        const counttd = document.createElement("td");
        counttd.innerText = `${product.rating_count}`;

        // const skutd = document.createElement("td");
        // idtd.innerText = `${product.id}`;

        tr.append(idtd);
        tr.append(titletd);
        tr.append(pricetd);
        tr.append(descriptiontd);
        tr.append(categorytd);
        tr.append(ratetd);
        tr.append(counttd);
        // tr.append(skutd);

        console.log(tr);

        tbody.append(tr);
    });
}
getProductList();
