const express = require('express');
const router = express.Router();
const { createUser, loginUserCtrl, getAllUser, getAUser, deleteAUser, updateAUser, blockAUser, unblockAUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, adminLogin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus } = require("../controller/user.controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

// Register a user
router.route('/register')
    .post(createUser);

// Login a user
router.route('/login')
    .post(loginUserCtrl)

router.route('/admin-login')
    .post(adminLogin)

// Get all users
router.route("/get-users")
    .get(getAllUser)

// Get a user by Id
router.route("/get-user/:id")
    .get(authMiddleware, isAdmin, getAUser)

// Delete a user by Id   
router.route("/delete-user/:id")
    .delete(deleteAUser)

// Update a user by Id
router.route("/edit-user")
    .put(authMiddleware, updateAUser)

// Save a user's single address
router.route("/save-address")
    .put(authMiddleware, saveAddress)

// Block a user by Id
router.route("/block-user/:id")
    .put(authMiddleware, isAdmin, blockAUser)

// Unblock a user by id
router.route("/unblock-user/:id")
    .put(authMiddleware, isAdmin, unblockAUser)

// Refresh token
router.route("/refresh")
    .get(handleRefreshToken)

// Logout a user
router.route("/logout")
    .get(logout)

// Reset Password of a user by token and id
router.route("/password")
    .put(authMiddleware, updatePassword)

// Generate token for forgot password
router.route('/forgot-password-token')
    .post(forgotPasswordToken)

// Reset password using token
router.route("/reset-password/:token")
    .put(resetPassword)

// Get a wishlist of specific user using token
router.route('/get-wishlist')
    .get(authMiddleware, getWishlist)

router.route("/cart")
    // Add to cart
    .post(authMiddleware, userCart)
    // Get a cart of specific user using token
    .get(authMiddleware, getUserCart)

router.route("/cart/apply-coupon")
    // Apply coupon
    .post(authMiddleware, applyCoupon)

router.route("/empty-cart")
    // Delete cart
    .delete(authMiddleware, emptyCart)

router.route("/cart/cash-order")
    .post(authMiddleware, createOrder)

router.route("/get-orders")
    .get(authMiddleware, getOrders)

router.route("/update-order/:id")
    .put(authMiddleware, isAdmin, updateOrderStatus)
module.exports = router;