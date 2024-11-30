const express = require("express");
const router = express.Router();
const { loginVendor, registerVendor, approveVendor, getVendors, rejectVendor } = require("../controllers/vendorController");

// Vendor registration route
router.post("/register", registerVendor);
// Vendor login route
router.post("/login", loginVendor);
router.get("/vendors", getVendors);
router.patch('/vendors/approve/:vendorId', approveVendor)
router.patch("/vendors/reject/:vendorId", rejectVendor);
module.exports = router;
