const express = require('express');
const router = express.Router();
const {createUser, loginUserCtrl, getAllUser, getAUser} = require("../controller/userCtrl")

router.route('/register')
    .post(createUser);

router.route('/login')
    .post(loginUserCtrl)

router.route("/get-users")
    .get(getAllUser)

router.route("/:id")
    .get(getAUser)

module.exports = router;