const express = require("express");
const router = express.Router();

const usercontroller = require("../../controllers/users");

router.post("/users/signup", usercontroller.postUser);
router.get("/users", usercontroller.getUsers);

module.exports = router;
