const Vendor = require("../models/Vendor");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
    // console.log(id);

    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "30d" });
};

// @desc Register a new vendor
// @route POST /api/vendor/register
// @access Public
const registerVendor = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" })
    }

    // if (password !== confirmPassword) {
    //     return res.status(400).json({ message: "Passwords do not match" });
    // }

    // Check if vendor already exists
    const vendorExists = await Vendor.findOne({ email });
    if (vendorExists) {
        return res.status(400).json({ message: "Vendor already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create vendor with default role as 'vendor'
    const vendor = await Vendor.create({
        name,
        email,
        password: hashedPassword,
        role: "vendor", // Default role for vendor
    });

    if (vendor) {
        return res.status(201).json({
            _id: vendor.id,
            name: vendor.name,
            email: vendor.email,
            role: vendor.role, // Include role in response
            // token: generateToken(vendor._id),
        });
    } else {
        return res.status(500).json({ message: "Unable to register vendor" });
    }
});

// @desc Login a vendor
// @route POST /api/vendor/login
// @access Public
const loginVendor = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find vendor by email
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
    }

    // Check if the vendor is approved
    if (!vendor.isApproved) {
        return res.status(403).json({ message: "Your account is not approved yet. Please wait for admin approval." });
    }

    // Compare password
    if (await bcrypt.compare(password, vendor.password)) {
        // Vendor is approved and password is correct, generate a JWT token
        const token = generateToken(vendor._id);

        // Set the token in an HTTP-only cookie
        res.cookie("vendorToken", token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
            maxAge: 3600000, // 1 hour in milliseconds
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            vendor: {
                _id: vendor.id,
                name: vendor.name,
                email: vendor.email,
                role: vendor.role,
                token
            },
        });
    } else {
        return res.status(401).json({ message: "Invalid email or password" });
    }
});




const getVendors = asyncHandler(async (req, res) => {
    const vendors = await Vendor.find({ isApproved: false }); // Get all vendors that are not approved
    res.status(200).json(vendors);
});


const approveVendor = asyncHandler(async (req, res) => {
    const { vendorId } = req.params; // Vendor ki ID jo approve karni hai, wo URL ke params mein milegi

    // Vendor ko find karo by ID
    const vendor = await Vendor.findById(vendorId);

    // Agar vendor nahi mila toh error bhejo
    if (!vendor) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    // Agar vendor already approve ho chuka hai, toh return karo
    if (vendor.isApproved) {
        return res.status(400).json({ success: false, message: "Vendor already approved" });
    }

    // Vendor ko approve karo
    vendor.isApproved = true;

    // Updated vendor ko save karo
    const updatedVendor = await vendor.save();

    // Success response bhejo
    res.status(200).json({ success: true, message: "Vendor approved successfully", vendor: updatedVendor });
});




const rejectVendor = asyncHandler(async (req, res) => {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    if (vendor.isApproved) {
        return res.status(400).json({ success: false, message: "Vendor already approved" });
    }

    // Use deleteOne or findByIdAndDelete
    await Vendor.findByIdAndDelete(vendorId); // Removes the vendor from the database

    res.status(200).json({ success: true, message: "Vendor rejected and removed" });
});







module.exports = {
    registerVendor,
    loginVendor,
    approveVendor,
    getVendors,
    rejectVendor


};
