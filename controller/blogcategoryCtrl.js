const BCategory = require("../models/blogcategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// Create a category
const createCategory = asyncHandler(async (req, res) => {
    let data = req.body;
    try {
        const newCategory = await BCategory.create(data);
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
        const updateCategory = await BCategory.findByIdAndUpdate(id, data, {
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
        const getACategory = await BCategory.findById(id);
        res.json(getACategory)
    } catch (error) {
        throw new Error(error);
    }
})

// Get all category
const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const getAllCategory = await BCategory.find();
        res.json(getAllCategory);
    } catch (error) {
        throw new Error(error);
    }
})

const deleteACategory = asyncHandler(async (req, res) => {
    let { id } = req.params;
    validateMongodbId(id);
    try {
        const deleteACategory = await BCategory.findByIdAndDelete(id);
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