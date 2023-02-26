const express = require('express');
const router = express.Router();
const {createUser, loginUserCtrl} = require("../controller/userCtrl")

router.route('/register')
    .post(createUser);

router.route('/login')
    .post(loginUserCtrl)

module.exports = router;