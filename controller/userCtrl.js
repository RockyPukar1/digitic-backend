const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwToken");

// Create a user
const createUser = asyncHandler(async (req, res, next) => {
    const email = req.email;
    const findUser = await User.findOne({ email });
    if (!findUser) {
        // create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        // User already exists
        throw new Error('User Already Exists');
    }
})

// Login a user
const loginUserCtrl = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        res.json({
            _id: findUser._id,
            firstname: findUser.firstname,
            lastname: findUser.lastname,
            email: findUser.email,
            mobile: findUser.mobile,
            token: generateToken(findUser._id)
        });
    } else {
        throw new Error("Invalid Credentials");
    }
})

// Get all users
const getAllUser = asyncHandler(async (req, res, next) => {
    try {
        const getUsers = await User.find()
        res.json(getUsers)
    } catch (error) {
        throw new Error(error);
    }
})

// Update a user by ID
const updateAUser = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    const {firstname, lastname, mobile, password, role} = req.body;
    try {
        const updateAUser = await User.findByIdAndUpdate(id, {
            firstname,
            lastname,
            password,
            mobile,
            role
        }, {
            new: true
        });
        res.json(updateAUser)
    }catch(error) {
        throw new Error(error);
    }
})

// Get a user by ID
const getAUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const getAUser = await User.findById(id);
        res.json({
            getAUser
        })
    } catch (error) {
        throw new Error(error);
    }
})

// Delete a user by ID
const deleteAUser = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    try {
        const deleteAUser = await User.findByIdAndDelete(id);
        res.json({
            deleteAUser
        })
    } catch(error) {
        throw new Error(error);
    }
})

module.exports = {
    createUser,
    loginUserCtrl,
    getAllUser,
    getAUser,
    deleteAUser,
    updateAUser
}