const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || "your_default_mongo_url_here";

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static("dist"))
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "https://bagshop-fglr.onrender.com",
    credentials: true,
}));
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use("/uploads", express.static("uploads"))

// Routes
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/admin", require("./routes/adminRoute"));
app.use("/api/cart", require("./routes/cartRoute"));
app.use('/api/order', require("./routes/orderRoutes"));
app.use('/api/vendor', require("./routes/vendorRoute"));
app.use('/api/productvendor', require("./routes/VendorProductRoute"));

// 404 Route
app.use("*", (req, res) => {

    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
    // message: "404: Resource Not Found",
});

// Database Connection
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB Connected");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("DB connection error:", err.message);
    });
