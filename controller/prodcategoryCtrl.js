const PCategory = require("../models/prodcategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// Create a category
const createCategory = asyncHandler(async(req, res, next) => {
    let data = req.body;
    try {
        const newCategory = await PCategory.create(data);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
    createCategory
};