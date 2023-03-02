const express = require("express");
const { createProduct, getAProduct, getAllProducts } = require("../controller/productCtrl");
const router = express.Router();

router.route("/")
    // Create a product
    .post(createProduct)

    // Get all Products
    .get(getAllProducts)

// Get a Product by Id
router.route("/:id")
    .get(getAProduct)

module.exports = router;