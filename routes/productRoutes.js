const express = require("express");
const { createProduct, getAProduct, getAllProducts, updateProduct, deleteProduct } = require("../controller/productCtrl");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

router.route("/")
    // Create a product
    .post(authMiddleware, isAdmin, createProduct)

    // Get all Products
    .get(getAllProducts)

router.route("/:id")
    // Get a Product by Id
    .get(getAProduct)

    // Update a product by Id
    .put(authMiddleware, isAdmin, updateProduct)
    
    // Delete a product by Id
    .delete(authMiddleware, isAdmin, deleteProduct)

module.exports = router;