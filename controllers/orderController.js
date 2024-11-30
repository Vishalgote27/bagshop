const expressAsyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Admin');
const Order = require('../models/Order');

// Place Order function
const placeOrder = expressAsyncHandler(async (req, res) => {
    const { userId, cartItems, phoneNumber, shippingAddress, totalPrice, paymentStatus } = req.body;

    try {
        // Step 1: Validate user existence
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found!' });
            return;
        }

        // Step 2: Validate cart items and fetch product details
        const productDetails = await Promise.all(
            cartItems.map(async (item) => {
                const product = await Product.findById(item.productId); // Use productId explicitly
                if (!product) {
                    throw new Error(`Product with ID ${item.productId} not found!`);
                }
                return {
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                    stock: product.stock,
                    image: product.image
                };
            })
        );

        // Step 3: Create and save the order
        const newOrder = new Order({
            userId,
            cartItems: productDetails,
            shippingAddress,
            totalPrice,
            phoneNumber,
            paymentStatus
        });

        const savedOrder = await newOrder.save();

        // Step 4: Return success response
        res.status(201).json({
            message: 'Order placed successfully!',
            order: savedOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while placing the order.',
            error: error.message
        });
    }
});

const getOrderById = expressAsyncHandler(async (req, res) => {
    const { orderId } = req.params;

    // Fetch order by ID from the database
    const order = await Order.findById(orderId).populate('userId', 'name email');  // You can populate fields as needed

    if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
    }

    res.status(200).json(order);
});

const getAllOrders = expressAsyncHandler(async (req, res) => {
    try {
        // Fetch all orders from the database
        // const orders = await Order.find({}).populate('user', 'name email'); // Populating user details if you store user IDs in orders
        const orders = await Order.find({}) // Populating user details if you store user IDs in orders

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found",
            });
        }

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});


// Controller function to get all orders for a specific user
const getOrdersByUserId = expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Fetch all orders for the user
    const orders = await Order.find({ userId }).populate('userId', 'name email');  // You can populate fields as needed

    if (!orders || orders.length === 0) {
        res.status(404).json({ message: 'No orders found for this user' });
        return;
    }

    res.status(200).json(orders);
});


const getMonthlySales = expressAsyncHandler(async (req, res) => {
    try {
        const monthlySales = await Order.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Group by month
                    totalRevenue: { $sum: "$totalPrice" }, // Total revenue
                    totalOrders: { $sum: 1 }, // Count of orders
                },
            },
            { $sort: { _id: 1 } }, // Sort by month
        ]);


        res.status(200).json(monthlySales);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


const getYearlySales = expressAsyncHandler(async (req, res) => {
    try {
        const yearlySales = await Order.aggregate([
            {
                $group: {
                    _id: { $year: "$createdAt" }, // Group by year
                    totalRevenue: { $sum: "$totalPrice" },
                    totalOrders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);


        res.status(200).json(yearlySales);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


const getTopProducts = expressAsyncHandler(async (req, res) => {
    try {
        // Aggregate query to get top products
        const topProducts = await Order.aggregate([
            { $unwind: "$cartItems" }, // cartItems array ko breakdown karna
            {
                $group: {
                    _id: "$cartItems.productId", // Product ID ke basis par group karna
                    totalQuantity: { $sum: "$cartItems.quantity" }, // Quantity ka total
                    totalRevenue: {
                        $sum: { $multiply: ["$cartItems.quantity", "$cartItems.price"] }, // Revenue calculate karna
                    },
                },
            },
            { $sort: { totalQuantity: -1 } }, // Quantity ke basis par descending sort
            { $limit: 5 }, // Top 5 products ka limit
            {
                $lookup: {
                    from: "products", // Products collection ka naam
                    localField: "_id", // Order ke productId ko match karna
                    foreignField: "_id", // Products collection ke _id se
                    as: "productDetails", // Result ko "productDetails" field mein store karna
                },
            },
            {
                $project: {
                    _id: 1,
                    totalQuantity: 1,
                    totalRevenue: 1,
                    productDetails: { $arrayElemAt: ["$productDetails", 0] }, // Sirf first matching product details fetch karo
                },
            },
        ]);

        // Agar koi product nahi mila
        if (topProducts.length === 0) {
            return res.status(404).json({
                message: "Koi product nahi mila.",
            });
        }

        // Response return karo
        res.status(200).json({
            success: true,
            data: topProducts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error hua hai.",
        });
    }
});






module.exports = { placeOrder, getOrderById, getOrdersByUserId, getMonthlySales, getYearlySales, getTopProducts, getAllOrders };
