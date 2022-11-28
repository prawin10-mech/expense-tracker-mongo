const express = require("express");
const router = express.Router();

const usercontroller = require("../controllers/users");

router.post("/signup", usercontroller.postUser);

router.get("/users", usercontroller.getUsers);

router.get("/:id", usercontroller.getUser);

router.post("/login/:email", usercontroller.postlogin);

router.get("/users/premiumusers", usercontroller.getPremiumUsers);

router.get("/password/forgotpassword/:email", usercontroller.getForgotPassword);

module.exports = router;
