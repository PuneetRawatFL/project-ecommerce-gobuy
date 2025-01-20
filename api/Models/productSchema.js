const mongoose = require("mongoose");

const productSchema = {
    id: { type: Number },
    title: { type: String },
    price: { type: Number },
    description: { type: String },
    category: { type: String },
    image: { type: String },
    rating: {
        rate: { type: Number },
        count: { type: Number },
    },
};

const Product = mongoose.model("Products", productSchema);

module.exports = Product;
