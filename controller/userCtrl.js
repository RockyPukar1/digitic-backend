const User = require("../models/userModel");

const createUser = async (req, res, next) => {
    const email = req.email;
    const findUser = await User.findOne(email);
    if (!findUser) {
        // create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        // User already exists
        res.json({
            msg: "User already exists",
            success: false
        })
    }
}

module.exports = {
    createUser
}