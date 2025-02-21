// fetch(`http://localhost:8001/get-product`);

const urlParams = new URLSearchParams(window.location.search);
const prodId = urlParams.get("id");

//fetch
fetch(`http://localhost:8001/get-product/${prodId}`)
    .then((res) => res.json())
    .then((result) => {
        console.log(result[0]);

        const title = document.querySelector("#title");
        const price = document.querySelector("#price");
        const description = document.querySelector("#description");
        const category = document.querySelector("#category");
        const ratingRate = document.querySelector("#rating_rate");
        const ratingCount = document.querySelector("#rating_count");
        const sku = document.querySelector("#sku");

        title.value = result[0].title;
        price.value = result[0].price;
        description.value = result[0].description;
        category.value = result[0].category;
        ratingRate.value = result[0].rating_rate;
        ratingCount.value = result[0].rating_count;
        sku.value = result[0].sku;

        //get images
        getImages();
    });

async function getImages() {
    const response = await fetch(
        `http://localhost:8001/mysql?mysqlQuery=select * from product_images where product_id = ${prodId}`
    );
    const result = await response.json();
    const img1 = document.querySelector("#img1");
    img1.src = `http://localhost:8001/uploads/${result[0].product_image}`;
    const img2 = document.querySelector("#img2");
    img2.src = `http://localhost:8001/uploads/${result[1].product_image}`;
}

const submitBtn = document.querySelector("#submitBtn");
submitBtn.addEventListener("click", async () => {
    event.preventDefault();

    const form = document.querySelector("#edit-form");
    // console.log(form);
    const formData = new FormData(form);
    console.log(formData);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const response = await fetch(
        `http://localhost:8001/edit-product/${prodId}`,
        {
            method: "POST",
            // headers: {
            //     "Content-Type": "application/json",
            // },
            // body: JSON.stringify(data),
            body: formData,
        }
    );
    const result = await response.json();
    console.log(result);
    if (result === "success") {
        toastr.success(
            "", //message
            "Product updated successfully", //title
            {
                timeOut: 2000,
                progressBar: true,
            } //timeout
        );
        setTimeout(() => {
            window.location.href = "manage-products.html";
        }, 2000);
    } else {
        toastr.error(
            "", //message
            "Error updating product", //title
            {
                timeOut: 2000,
                progressBar: true,
            } //timeout
        );
    }
});
