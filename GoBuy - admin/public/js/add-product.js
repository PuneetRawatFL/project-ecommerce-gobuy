const submitBtn = document.querySelector("#submitBtn");
submitBtn.addEventListener("click", async () => {
    event.preventDefault();

    const form = document.querySelector("#product-form");
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    // console.log(data);

    const response = await fetch(`http://localhost:8001/add-product`, {
        method: "POST",
        body: formData,
    });
    const result = await response.json();
    console.log(result);
    if (result.message) {
        $(function () {
            toastr.success(
                "", //message
                "Product added successfully", //title
                {
                    timeOut: 2000,
                    progressBar: true,
                } //timeout
            );
        });
    } else {
        $(function () {
            toastr.error(
                "", //message
                "Error adding product", //title
                {
                    timeOut: 2000,
                    progressBar: true,
                } //timeout
            );
        });
    }

    setTimeout(() => {
        window.location.href = "../html/manage-products.html";
    }, 2000);
});
