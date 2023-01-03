const express = require("express");
const router = express.Router();

const usercontroller = require("../controllers/users");
const userAuthenticate = require("../middleware/authenticate");
const expenseController = require("../controllers/expenses");

router.post("/signup", usercontroller.postUser);

router.get("/users", usercontroller.getUsers);

router.get("/:id", usercontroller.getUser);

router.post("/login/:email", usercontroller.postlogin);

router.get("/users/premiumusers", usercontroller.getPremiumUsers);

// router.get(
//   "/expenses/download",
//   userAuthenticate.authenticate,
//   expenseController.downloadExpenses
// );

module.exports = router;
