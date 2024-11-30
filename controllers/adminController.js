// controllers/AdminController.js
const Product = require("../models/Admin");
const asyncHandler = require("express-async-handler");
const fs = require('fs');
const path = require('path');

// Add a new product
const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, stock, count } = req.body;
    // const image = req.file ? req.file.path : null;
    const image = req.file ? req.file.path.replace(/\\+/g, '/') : null; // Ensure forward slashes

    const product = new Product({
        name,
        description,
        price,
        category,
        stock,
        count,
        image,
    });

    const createdProduct = await product.save();

    res.status(201).json({
        message: "Product added successfully",
        product: createdProduct,

    });
});

const getAllProducts = asyncHandler(async (req, res) => {
    // Fetch all products from the database
    const products = await Product.find();

    if (!products) {
        res.status(404);
        throw new Error("No products found");
    }

    // Return the products as a JSON response
    res.status(200).json(products);
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;  // Extract the product ID from the route params
    const { name, description, price, category, image, stock, count } = req.body;  // Extract product details from the request body

    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Update the product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;

    // If category is passed, it should be an array, so we assign it
    if (category) {
        product.category = Array.isArray(category) ? category : [category];  // Ensure category is an array
    }

    product.stock = stock || product.stock;
    product.count = count || product.count;  // Update count

    // If an image is uploaded, update the image path
    if (req.file) {
        product.image = `uploads/${req.file.filename}`; // Update the image path
    }

    // Save the updated product
    const updatedProduct = await product.save();

    // Return the updated product
    res.status(200).json({
        message: "Product updated successfully",
        updatedProduct,  // contains the updated product data
    });
});

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find the product by ID
    const product = await Product.findById(id);

    if (product) {
        res.status(200).json({ message: "One Product Get", product }) // Send product details as a response
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    // Find and delete the product by ID
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product has an image path
    if (product.image) {
        // Normalize the path, ensuring it uses appropriate separators
        const imagePath = path.normalize(path.join(__dirname, '..', product.image));

        // Log the path to verify it's correct
        console.log("Deleting image at path:", imagePath);

        // Check if the image file exists
        fs.stat(imagePath, (err, stats) => {
            if (err) {
                console.error("Image not found:", err);
                // Return a success message if the product was deleted but image wasn't found
                return res.status(200).json({ message: "Product deleted successfully, but image file was not found." });
            }

            // If the image exists, delete it
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Failed to delete image:", err);
                    return res.status(500).json({ message: "Product deleted, but failed to delete image." });
                }

                // Success response after deleting both the product and its image
                res.status(200).json({ message: "Product and image deleted successfully" });
            });
        });
    } else {
        // No image associated with the product, just return a success message
        res.status(200).json({ message: "Product deleted successfully, no image to delete." });
    }
});




module.exports = { addProduct, getAllProducts, updateProduct, getProductById, deleteProduct }