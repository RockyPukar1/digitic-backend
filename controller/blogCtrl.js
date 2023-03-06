const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// Create a Blog
const createBlog = asyncHandler(async (req, res, next) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json({
            newBlog
        })
    } catch (error) {
        throw new Error(error);
    }
})

// Update a Blog by Id
const updateBlog = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updateBlog)
    } catch (error) {
        throw new Error(error)
    }
})

// Get all blogs
const getAllBlog = asyncHandler(async (req, res, next) => {
    try {
        let getAllBlog = await Blog.find();
        getAllBlog = getAllBlog.map(async (blog) => {
            await Blog.findByIdAndUpdate(blog._id, {
                $inc: { numViews: 1 }
            }, {
                new: true
            })
        })
        getAllBlog = await Blog.find();
        res.json(getAllBlog);
    } catch (error) {
        throw new Error(error);
    }
})

// Get a Blog by Id
const getABlog = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const getABlog = await Blog.findById(id);
        await Blog.findByIdAndUpdate(id, {
            $inc: { numViews: 1 }
        }, {
            new: true
        })
        res.json(getABlog);
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
    createBlog,
    updateBlog,
    getAllBlog,
    getABlog
}