const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// Create a Blog
const createBlog = asyncHandler(async (req, res) => {
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
const updateBlog = asyncHandler(async (req, res) => {
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
const getAllBlog = asyncHandler(async (req, res) => {
    try {
        const getAllBlog = await Blog.find();
        res.json(getAllBlog);
    } catch (error) {
        throw new Error(error);
    }
})

// Get a Blog by Id
const getABlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const getABlog = await Blog.findById(id).populate('likes').populate('dislikes');
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

// Delete Blogs by Id
const deleteABlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deleteABlog = await Blog.findByIdAndDelete(id);
        res.json(deleteABlog);
    } catch (error) {
        throw new Error(error);
    }
})

// Like a blog
const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodbId(blogId);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // Find the login user
    const loginUserId = req.user._id;
    // Find if the user has liked the post
    const isLiked = blog.isLiked;
    // Find if the user has disliked the post
    const alreadyDisliked = blog.dislikes.find((userId => userId.toString() === loginUserId.toString()));
    if (alreadyDisliked) {
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            $set: { isDisliked: false }
        }, {
            new: true
        });
        res.json(updatedBlog);
    }
    if (isLiked) {
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            $set: { isLiked: false }
        }, {
            new: true
        })
        res.json(updatedBlog);
    } else {
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            $set: { isLiked: true }
        }, {
            new: true
        })
        res.json(updatedBlog);
    }
})

// Dislike a blog
const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodbId(blogId);
    // Find the blog which you want to be disliked
    const blog = await Blog.findById(blogId);
    // Find the login user
    const loginUserId = req.user._id;
    // Find if the user has disliked the post
    const isDisliked = blog.isDisliked;
    // Find if the user has disliked the post
    const alreadyLiked = blog.likes.find((userId => userId.toString() === loginUserId.toString()));
    if (alreadyLiked) {
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            $set: { isLiked: false }
        }, {
            new: true
        });
        res.json(updatedBlog);
    }
    if (isDisliked) {
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            $set: { isDisliked: false }
        }, {
            new: true
        })
        res.json(updatedBlog);
    } else {
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId },
            $set: { isDisliked: true }
        }, {
            new: true
        })
        res.json(updatedBlog);
    }
})


module.exports = {
    createBlog,
    updateBlog,
    getAllBlog,
    getABlog,
    deleteABlog,
    likeBlog,
    dislikeBlog
}