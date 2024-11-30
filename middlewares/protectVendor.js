const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Vendor = require('../models/Vendor');

// Middleware to protect vendor-specific routes
const protectVendor = asyncHandler(async (req, res, next) => {
    const token = req.cookies.vendorToken; // Extract token from cookie
    console.log(token);

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token found" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // Fetch vendor by ID and attach to request
        const vendor = await Vendor.findById(decoded.id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        req.vendor = vendor;
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
});

module.exports = { protectVendor };
