const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require("../models/User");

// Create a new user
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, number } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Hash the password asynchronously
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with default role 'user'
    const user = await User.create({ name, email, password: hashedPassword, number, role: "user" });

    res.status(201).json({
        message: "User registered successfully",
        user
    });
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body; // Expecting email and password in the body

    // Find user by email only
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid  password" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
        // Password matches, user is logged in

        // Create a token
        const token = jwt.sign(
            { id: user._id, role: user.role }, // Payload
            process.env.JWT_KEY, // Secret from environment variables
            { expiresIn: '1h' } // Token expiration time
        );

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
            maxAge: 3600000, // 1 hour in milliseconds
        });

        // Respond with user information
        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
                role: user.role,
                token
            }
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
});






// Get all users
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// Get a single user by ID
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    res.status(200).json(user);
});

module.exports = { registerUser, getUsers, getUserById, loginUser };
