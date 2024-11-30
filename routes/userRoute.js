const express = require("express");
const router = express.Router();
const { registerUser, getUsers, getUserById, loginUser } = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");

router.post("/register", registerUser); // Create a user
router.post("/login", loginUser);
router.get("/", getUsers);    // Get all users
// router.get("/", authMiddleware, getUsers);    // Get all users
router.get("/:id", getUserById); // Get user by ID

module.exports = router;
