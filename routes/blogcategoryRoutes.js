const express = require("express");
const { createCategory, udpateCategory, getACategory, getAllCategory, deleteACategory } = require("../controller/blogcategoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// Create a product
router.route('/create')
    .post(authMiddleware, isAdmin, createCategory)

router.route('/edit-one/:id')
    .put(authMiddleware, isAdmin, udpateCategory)

router.route('/get-one/:id')
    .get(getACategory)

router.route('/get-all')
    .get(getAllCategory)

router.route('/delete-one/:id')
    .delete(authMiddleware, isAdmin, deleteACategory)

module.exports = router;