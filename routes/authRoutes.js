const express = require('express');
const router = express.Router();
const {createUser, loginUserCtrl, getAllUser, getAUser, deleteAUser, updateAUser} = require("../controller/userCtrl")

router.route('/register')
    .post(createUser);

router.route('/login')
    .post(loginUserCtrl)

router.route("/get-users")
    .get(getAllUser)

router.route("/:id")
    .get(getAUser)

router.route("/:id")
    .delete(deleteAUser)

router.route("/:id")
    .put(updateAUser)

module.exports = router;