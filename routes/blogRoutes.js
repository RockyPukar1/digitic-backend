const express = require("express");
const { createBlog, updateBlog, getAllBlog, getABlog, deleteABlog, likeBlog, dislikeBlog } = require("../controller/blogCtrl");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/create")
    // Create a new Blog
    .post(authMiddleware, isAdmin, createBlog)
router.route("/get-all")
    // Get all blogs
    .get(getAllBlog)
router.route("/likes")
    // Update likes
    .put(authMiddleware, likeBlog)
router.route("/dislikes")
    // Update dislikes
    .put(authMiddleware, dislikeBlog)
router.route("/get-one/:id")
    // Get a blog by ID
    .get(getABlog)
router.route("/edit-one/:id")
    // Update a blog by Id
    .put(authMiddleware, isAdmin, updateBlog)
router.route("/delete-one/:id")
    // Delete a blog by Id
    .delete(authMiddleware, isAdmin, deleteABlog)

module.exports = router;