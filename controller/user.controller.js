const User = require("../models/user.model");
const Product = require("../models/product.model")
const Cart = require("../models/cart.model")
const Coupon = require("../models/coupon.model");
const Order = require("../models/order.model");
const uniqid = require("uniqid");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwt.config");
const validateMongodbId = require("../utils/validate.mongodbId");
const generateRefreshToken = require("../config/refresh-token.config");
const jwt = require("jsonwebtoken");
const sendEmail = require("./email.controller");
const crypto = require("crypto");

// Create a user
const createUser = asyncHandler(async (req, res) => {
    const email = req.email;
    const findUser = await User.findOne({ email });
    if (!findUser) {
        // create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        // User already exists
        throw new Error('User Already Exists');
    }
})

// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser._id);
        const updateUser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken
        }, {
            new: true
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        res.json({
            _id: findUser._id,
            firstname: findUser.firstname,
            lastname: findUser.lastname,
            email: findUser.email,
            mobile: findUser.mobile,
            token: generateToken(findUser._id)
        });
    } else {
        throw new Error("Invalid Credentials");
    }
})

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) {
        throw new Error("No Refresh Token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        throw new Error("No Refresh Token present in db or not matched");
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || (user.id !== decoded.id)) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user._id);
        res.json({ accessToken });
    });
})

// Get all users
const getAllUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find()
        res.json(getUsers)
    } catch (error) {
        throw new Error(error);
    }
})

// Update a user by ID
const updateAUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    const { firstname, lastname, mobile, password, role } = req.body;
    try {
        const updateAUser = await User.findByIdAndUpdate(_id, {
            firstname,
            lastname,
            password,
            mobile,
            role
        }, {
            new: true
        });
        res.json(updateAUser)
    } catch (error) {
        throw new Error(error);
    }
})

// Get a user by ID
const getAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const getAUser = await User.findById(id);
        res.json({
            getAUser
        })
    } catch (error) {
        throw new Error(error);
    }
})

// Delete a user by ID
const deleteAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deleteAUser = await User.findByIdAndDelete(id);
        res.json({
            deleteAUser
        })
    } catch (error) {
        throw new Error(error);
    }
})

// Block a user by Id
const blockAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true
        }, {
            new: true
        });
        res.json({
            message: "User blocked"
        })
    } catch (error) {
        throw new Error(error);
    }
})

// Unblock a user by Id
const unblockAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(id, {
            isBlocked: false
        }, {
            new: true
        })
        res.json("User unblocked")
    } catch (error) {
        throw new Error(error);
    }
})

// Logout Functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    console.log(cookie);
    if (!cookie.refreshToken) {
        throw new Error("No Refresh Token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        });
        res.sendStatus(204);
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: ""
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    res.sendStatus(204); // forbidden
})

// Update password
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    const { password } = req.body;
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
})

// Get a password reset link
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found with this email");
    }
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:9000/api/user/reset-password/${token}>Click here</a>`;
        const data = {
            to: email,
            subject: "Forgot Password Link",
            text: "Hey User",
            htm: resetURL
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
})

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) {
        throw new Error("Token expired, Please try again later");
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
})

// admin login
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== 'admin') {
        throw new Error("Not authorized");
    }
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin._id);
        const updateUser = await User.findByIdAndUpdate(findAdmin.id, {
            refreshToken
        }, {
            new: true
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        res.json({
            _id: findAdmin._id,
            firstname: findAdmin.firstname,
            lastname: findAdmin.lastname,
            email: findAdmin.email,
            mobile: findAdmin.mobile,
            token: generateToken(findAdmin._id)
        });
    } else {
        throw new Error("Invalid Credentials");
    }
})

// Get wishlist
const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const findUser = await User.findById(_id).populate('wishlist');
        res.json(findUser);
    } catch (error) {
        throw new Error(error);
    }
})

// Save user address
const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            address: req.body.address
        }, {
            new: true
        })
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
})

// User cart functionality
const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        let products = [];
        const user = await User.findById(_id);
        // Check if user already have products in cart
        const alreadyExistCart = await Cart.findOne({ orderby: user._id });
        if (alreadyExistCart) {
            alreadyExistCart.remove();
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select('price').exec();
            object.price = getPrice.price;
            products.push(object);
        }
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user._id
        }).save();
        res.json(newCart)
    } catch (error) {
        throw new Error(error);
    }
})

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const cart = await Cart.findOne({ orderby: _id }).populate('products.product');
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
})

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndRemove({ orderby: user._id });
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
})

const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const validCoupon = await Coupon.findOne({ name: coupon });
        if (validCoupon === null) {
            throw new Error("Invalid Coupon")
        }
        const user = await User.findOne({ _id });
        let { cartTotal } = await Cart.findOne({ orderby: user._id }).populate('products.product');
        let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
        await Cart.findOneAndUpdate({ orderby: user._id }, {
            totalAfterDiscount
        }, {
            new: true
        })
        res.json(totalAfterDiscount)
    } catch (error) {
        throw new Error(error);
    }
});

const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        if (!COD) {
            throw new Error("Create cash order failed");
        }
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({ orderby: user._id })
        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        } else {
            finalAmount = userCart.cartTotal;
        }
        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "usd"
            },
            orderby: user._id,
            orderStatus: "Cash on Delivery"
        }).save();
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } }
                }
            }
        })
        const updated = await Product.bulkWrite(update, {});
        res.json({
            message: "success"
        })
    } catch (error) {
        throw new Error(error);
    }
})

const getOrders = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const userOrders = await Order.findOne({ orderby: _id }).populate("products.product").exec();
        res.json(userOrders);
    } catch (error) {
        throw new Error(error);
    }
})

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(id, {
            orderStatus: status,
            paymentIntent: {
                status: status
            }
        }, {
            new: true
        });
        res.json(updateOrderStatus);
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
    createUser,
    loginUserCtrl,
    getAllUser,
    getAUser,
    deleteAUser,
    updateAUser,
    blockAUser,
    unblockAUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    adminLogin,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus
}