const express = require("express");
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon } = require("../controller/coupon.controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/create")
    .post(authMiddleware, isAdmin, createCoupon)

router.route('/get-all')
    .get(authMiddleware, isAdmin, getAllCoupons)

router.route('/edit-one/:id')
    .put(authMiddleware, isAdmin, updateCoupon)

router.route('/delete-one/:id')
    .delete(authMiddleware, isAdmin, deleteCoupon)

module.exports = router;