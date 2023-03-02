const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

// Create a New Product
const createProduct = asyncHandler(async (req, res, next) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
})

// Update a product by Id
const updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findOneAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateProduct);
    } catch (error) {
        throw new Error(error);
    }
})

// Delete product by Id
const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct);
    } catch(error) {
        throw new Error(error);
    }
})

// Get a Product by Id
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
    } catch (error) {
        throw new Error(error);
    }
})


module.exports = {
    createProduct,
    getAProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
}