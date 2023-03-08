const Coupon = require("../models/coupon.model");
const validateMongodbId = require("../utils/validate.mongodbId");
const asyncHandler = require("express-async-handler");

// Create coupon
const createCoupon = asyncHandler(async (req, res, next) => {
    let data = req.body;
    try {
        const newCoupon = await Coupon.create(data);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
    createCoupon
}