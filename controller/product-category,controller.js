const PCategory = require("../models/product-category.model");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validate.mongodbId");

// Create a category
const createCategory = asyncHandler(async (req, res) => {
    let data = req.body;
    try {
        const newCategory = await PCategory.create(data);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
})

// Update a cateogory by ID
const udpateCategory = asyncHandler(async (req, res) => {
    let data = req.body;
    let { id } = req.params;
    validateMongodbId(id);
    try {
        const updateCategory = await PCategory.findByIdAndUpdate(id, data, {
            new: true
        });
        res.json(updateCategory);
    } catch (error) {
        throw new Error(error);
    }
})

// Get A Product by ID
const getACategory = asyncHandler(async (req, res) => {
    let { id } = req.params;
    validateMongodbId(id);
    try {
        const getACategory = await PCategory.findById(id);
        res.json(getACategory)
    } catch (error) {
        throw new Error(error);
    }
})

// Get all category
const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const getAllCategory = await PCategory.find();
        res.json(getAllCategory);
    } catch (error) {
        throw new Error(error);
    }
})

const deleteACategory = asyncHandler(async (req, res) => {
    let { id } = req.params;
    validateMongodbId(id);
    try {
        const deleteACategory = await PCategory.findByIdAndDelete(id);
        res.json(deleteACategory);
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
    createCategory,
    udpateCategory,
    getACategory,
    getAllCategory,
    deleteACategory
};