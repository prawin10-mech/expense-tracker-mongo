const express = require("express");
const router = express.Router();

const usercontroller = require("../controllers/users");

router.post("/signup", usercontroller.postUser);

router.get("/users", usercontroller.getUsers);

router.post("/login/:email", usercontroller.postlogin);

module.exports = router;
