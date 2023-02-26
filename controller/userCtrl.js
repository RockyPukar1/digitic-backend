const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwToken");

const createUser = asyncHandler(async (req, res, next) => {
    const email = req.email;
    const findUser = await User.findOne(email);
    if (!findUser) {
        // create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        // User already exists
        throw new Error('User Already Exists');
    }
})

const loginUserCtrl = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;
    // check if user exists or not
    const findUser = await User.findOne({email});
    if (findUser && await findUser.isPasswordMatched(password)) {
        res.json({
            _id: findUser._id,
            lastname: findUser.lastname,
            email: findUser.email,
            mobile: findUser.mobile,
            token: generateToken(findUser._id)
        });
    } else {
        throw new Error("Invalid Credentials");
    }
})
module.exports = {
    createUser,
    loginUserCtrl
}