const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Assuming userId is a reference to a User model
        ref: 'User',
        required: true
    },
    cartItems: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true }, // Assuming the cart includes product names
            price: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    shippingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^[0-9]+$/ // Validation for digits only
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        // enum: ['Cash On Delivery', 'Paid', 'Pending'], // Enum for predefined payment statuses
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
