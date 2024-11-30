const express = require("express");
const { addVendorProduct, getAllProductsVendor, getProductByIdVendor, updateVendorProduct, deleteVendorProduct, getProductsByVendor } = require("../controllers/VendorProductController");
const upload = require("../middlewares/upload");
const { protectVendor } = require("../middlewares/protectVendor");
const router = express.Router();



router.post("/addproductvendor", upload, protectVendor, addVendorProduct); // Add Product
router.get("/getproductsvendor", getAllProductsVendor); // Get All Products
router.get("/vendorproduct/:id", getProductByIdVendor); // Get Product by ID
router.get("/vendor/:vendorId/products", getProductsByVendor);
router.put("/vendoreditproduct/:id", upload, updateVendorProduct); // Update Product
router.delete("/vendorremoveproduct/:id", deleteVendorProduct); // Delete Product

module.exports = router;
