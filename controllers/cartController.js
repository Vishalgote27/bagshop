const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");

const addToCart = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (cart) {
        // Cart exists, update the quantity
        const existingItem = cart.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity; // Increase the quantity
        } else {
            cart.items.push({ productId, quantity }); // Add new item to the cart
        }
        await cart.save(); // Save the updated cart
    } else {
        // If cart doesn't exist, create a new one
        cart = new Cart({
            userId,
            items: [{ productId, quantity }],
        });
        await cart.save();
    }

    return res.status(200).json({ message: 'Item added to cart successfully' });
});

// Export the controller functions
module.exports = { addToCart };