const express = require('express');
const router = express.Router();
const {createUser, loginUserCtrl, getAllUser, getAUser, deleteAUser, updateAUser, blockAUser, unblockAUser, handleRefreshToken, logout} = require("../controller/userCtrl");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");

// Register a user
router.route('/register')
    .post(createUser);

// Login a user
router.route('/login')
    .post(loginUserCtrl)

// Get all users
router.route("/get-users")
    .get(getAllUser)

// Get a user by Id
router.route("/get-user/:id")
    .get(authMiddleware, isAdmin, getAUser)

// Delete a user by Id   
router.route("/delete-user/:id")
    .delete(deleteAUser)

// Update a user by Id
router.route("/edit-user")
    .put(authMiddleware, updateAUser)

router.route("/block-user/:id")
    .put(authMiddleware, isAdmin, blockAUser)

router.route("/unblock-user/:id")
    .put(authMiddleware, isAdmin, unblockAUser)

router.route("/refresh")
    .get(handleRefreshToken)

router.route("/logout")
    .get(logout)

module.exports = router;