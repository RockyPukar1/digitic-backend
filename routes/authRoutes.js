const express = require('express');
const router = express.Router();
const {createUser} = require("../controller/userCtrl")

router.route('/register')
    .post(createUser);

module.exports = router;