const Coupon = require("../models/coupon.model");
const validateMongodbId = require("../utils/validate.mongodbId");
const asyncHandler = require("express-async-handler");

// Create coupon
const createCoupon = asyncHandler(async (req, res) => {
    let data = req.body;
    try {
        const newCoupon = await Coupon.create(data);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
})

// Get All Coupons
const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const getAllCoupons = await Coupon.find();
        res.json(getAllCoupons);
    } catch (error) {
        throw new Error(error);
    }
})

// Update a coupon by id
const updateCoupon = asyncHandler(async (req, res, next) => {
    let { id } = req.params;
    validateMongodbId(id);
    let data = req.body;
    try {
        const updateCoupon = await Coupon.findByIdAndUpdate(id, data, {
            new: true
        })
        res.json(updateCoupon);
    } catch (error) {
        throw new Error(error);
    }
})

// Delete a coupon by id
const deleteCoupon = asyncHandler(async (req, res, next) => {
    let { id } = req.params;
    validateMongodbId(id);
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deleteCoupon);
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon
}