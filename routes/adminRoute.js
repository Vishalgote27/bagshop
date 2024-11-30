// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { addProduct, getAllProducts, updateProduct, getProductById, deleteProduct } = require("../controllers/adminController");
const upload = require("../middlewares/upload");

router.get("/", getAllProducts);
router.post("/add-product", upload, addProduct);
router.put("/productedit/:id", upload, updateProduct);
router.get('/product/:id', getProductById)
router.delete("/deleteproduct/:id", deleteProduct);

module.exports = router;
