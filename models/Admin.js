// models/Product.js
const mongoose = require("mongoose");

const AdminProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: [String] }, // Allows multiple categories (array of strings)
    image: { type: String }, // to store the file path or URL
    stock: { type: Number, default: 0 },
    count: { type: Number, default: 1 }, // Add count field
    createdAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model("Product", AdminProductSchema);
