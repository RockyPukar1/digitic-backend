const express = require("express");
const { createCoupon } = require("../controller/coupon.controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/create")
    .post(authMiddleware, isAdmin, createCoupon)

module.exports = router;