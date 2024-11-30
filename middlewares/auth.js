// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const protected = (req, res, next) => {
    const token = req.cookies.token; // Assuming you store the token in cookies


    if (!token) {
        return res.status(401).json({ message: "Unauthorized access, no token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY); // Use your JWT secret here
        req.user = decoded; // Attach user information to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
};

module.exports = protected;
