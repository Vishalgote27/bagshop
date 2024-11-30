const asyncHandler = require("express-async-handler");
const VendorProduct = require("../models/VendorProduct");
const fs = require('fs');
const path = require('path');
// Add a new product
const addVendorProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, stock, brand } = req.body;
    const image = req.file ? req.file.path.replace(/\\+/g, '/') : null; // Get image path if available
    const vendorId = req.vendor._id
    console.log(vendorId);

    const product = new VendorProduct({
        name,
        description,
        price,
        category,
        image, // Store image path
        stock,
        brand,
        vendorId
    });

    console.log(product);

    try {
        const savedProduct = await product.save();
        res.status(201).json({ success: true, product: savedProduct });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error saving product", error: err });
    }
});


// Get all products
const getAllProductsVendor = asyncHandler(async (req, res) => {
    const products = await VendorProduct.find();
    res.status(200).json({ success: true, products });
});


const getProductsByVendor = asyncHandler(async (req, res) => {
    const { vendorId } = req.params;

    // Ensure vendorId is provided
    if (!vendorId) {
        return res.status(400).json({ success: false, message: "Vendor ID is required" });
    }

    try {
        // Fetch products where vendorId matches
        const products = await VendorProduct.find({ vendorId });

        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found for this vendor" });
        }



        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});



// Get a single product by ID
const getProductByIdVendor = asyncHandler(async (req, res) => {
    const product = await VendorProduct.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    res.status(200).json({ success: true, product });
});


// Update a product
const updateVendorProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, stock, brand } = req.body;

        console.log("req.body:", req.body);
        console.log("req.file:", req.file);

        const product = await VendorProduct.findById(id);

        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }

        const updateData = {
            name: name || product.name,
            description: description || product.description,
            price: price || product.price,
            category: category || product.category,
            stock: stock || product.stock,
            brand: brand || product.brand,
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedProduct = await VendorProduct.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Delete a product
const deleteVendorProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        const product = await VendorProduct.findById(id);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        // Check if the product has an associated image
        if (product.image) {
            const imagePath = path.join(__dirname, '..', product.image); // Construct the image path

            // Delete the image from the server
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Failed to delete the image:', err);
                } else {
                    console.log('Image deleted successfully:', product.image);
                }
            });
        }

        // Delete the product from the database
        await VendorProduct.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = {
    addVendorProduct,
    getAllProductsVendor,
    getProductByIdVendor,
    deleteVendorProduct,
    updateVendorProduct,
    getProductsByVendor
};
