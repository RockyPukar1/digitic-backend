const express = require("express");
const { createProduct, getAProduct, getAllProducts, updateProduct, deleteProduct, addToWishlist } = require("../controller/productCtrl");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

router.route("/create")
    // Create a product
    .post(authMiddleware, isAdmin, createProduct)
router.route('/get-all')
    // Get all Products
    .get(getAllProducts)
router.route("/wishlist")
    // Add to wishlist
    .put(authMiddleware, addToWishlist)
router.route("/get-one/:id")
    // Get a Product by Id
    .get(getAProduct)
router.route("/edit-one/:id")
    // Update a product by Id
    .put(authMiddleware, isAdmin, updateProduct)
router.route("/delete-one/:id")
    // Delete a product by Id
    .delete(authMiddleware, isAdmin, deleteProduct)

module.exports = router;