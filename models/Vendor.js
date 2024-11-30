const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            default: "vendor", // Default role is set to "vendor"
        },
        isApproved: {
            type: Boolean,
            required: true,
            default: false, // Vendor will not be approved by default
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
