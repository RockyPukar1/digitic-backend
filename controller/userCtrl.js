const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwToken");
const validateMongodbId = require("../utils/validateMongodbId");
const generateRefreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
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
        const refreshToken = await generateRefreshToken(findUser._id);
        const updateUser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken
        }, {
            new: true
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
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

// handle refresh token
const handleRefreshToken = asyncHandler(async(req, res, next) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) {
        throw new Error("No Refresh Token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if (!user) {
        throw new Error("No Refresh Token present in db or not matched");
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || (user.id !== decoded.id)) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user._id);
        res.json({accessToken});
    });
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
const updateAUser = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const { firstname, lastname, mobile, password, role } = req.body;
    try {
        const updateAUser = await User.findByIdAndUpdate(_id, {
            firstname,
            lastname,
            password,
            mobile,
            role
        }, {
            new: true
        });
        res.json(updateAUser)
    } catch (error) {
        throw new Error(error);
    }
})

// Get a user by ID
const getAUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongodbId(id);
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
const deleteAUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deleteAUser = await User.findByIdAndDelete(id);
        res.json({
            deleteAUser
        })
    } catch (error) {
        throw new Error(error);
    }
})

// Block a user by Id
const blockAUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true
        }, {
            new: true
        });
        res.json({
            message: "User blocked"
        })
    } catch (error) {
        throw new Error(error);
    }
})

// Unblock a user by Id
const unblockAUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(id, {
            isBlocked: false
        }, {
            new: true
        })
        res.json("User unblocked")
    } catch (error) {
        throw new Error(error);
    }
})

// Logout Functionality
const logout = asyncHandler(async(req, res, next) => {
    const cookie = req.cookies;
    console.log(cookie);
    if (!cookie.refreshToken) {
        throw new Error("No Refresh Token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204);
        us(204); // forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: ""
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    res.sendStatus(204); // forbidden
})

module.exports = {
    createUser,
    loginUserCtrl,
    getAllUser,
    getAUser,
    deleteAUser,
    updateAUser,
    blockAUser,
    unblockAUser,
    handleRefreshToken,
    logout
}