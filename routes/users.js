const express = require("express");
const router = express.Router();

const usercontroller = require("../controllers/users");
const authenticatemiddleware = require("../middleware/authenticate");

router.post("/signup", usercontroller.postUser);

router.get("/users", usercontroller.getUsers);

router.get("/:id", usercontroller.getUser);

router.post("/login/:email", usercontroller.postlogin);

router.get("/users/premiumusers", usercontroller.getPremiumUsers);

module.exports = router;
