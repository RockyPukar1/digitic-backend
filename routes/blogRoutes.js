const express = require("express");
const { createBlog, updateBlog, getAllBlog, getABlog, deleteABlog, likeBlog, dislikeBlog } = require("../controller/blogCtrl");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/")
    // Create a new Blog
    .post(authMiddleware, isAdmin, createBlog)
    // Get all blogs
    .get(getAllBlog)

router.route("/likes")
    .put(authMiddleware, likeBlog)
router.route("/dislikes")
    .put(authMiddleware, dislikeBlog)
    
router.route("/:id")
    // Get a blog by ID
    .get(getABlog)
    // Update a blog by Id
    .put(authMiddleware, isAdmin, updateBlog)
    // Delete a blog by Id
    .delete(authMiddleware, isAdmin, deleteABlog)

module.exports = router;