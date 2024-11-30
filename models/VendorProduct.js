const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL ya path ke liye

    },
    stock: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        default: 0, // Kitni baar product ko dekha gaya ya use kiya gaya hai
    },
    createdAt: {
        type: Date,
        default: Date.now, // Default current time
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor', // Vendor model ka reference
    },
});

module.exports = mongoose.model('VendorProduct', productSchema);
