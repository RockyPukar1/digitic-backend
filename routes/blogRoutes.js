const express = require("express");
const { createBlog, updateBlog, getAllBlog, getABlog } = require("../controller/blogCtrl");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/")
    // Create a new Blog
    .post(authMiddleware, isAdmin, createBlog)
    // Get all blogs
    .get(getAllBlog)

router.route("/:id")
    .get(getABlog)
    // Update a blog by Id
    .put(authMiddleware, isAdmin, updateBlog)

module.exports = router;