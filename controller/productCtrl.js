const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

// Create a New Product
const createProduct = asyncHandler(async (req, res, next) => {
    try {
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
})

// Get a Product
const getAProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct)
    } catch (error) {
        throw new Error(error)
    }
})

// Get all Product
const getAllProducts = asyncHandler(async (req, res, next) => {
    try {
        const getAllProduct = await Product.find();
        res.json(getAllProduct)
    } catch(error) {
        throw new Error(error);
    }
})
module.exports = {
    createProduct,
    getAProduct,
    getAllProducts
}