const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expenses");
const userAuthenticate = require("../middleware/authenticate");

router.post(
  "/expenses",
  userAuthenticate.authenticate,
  expenseController.postExpenses
);

router.get(
  "/expenses",
  userAuthenticate.authenticate,
  expenseController.getExpenses
);

router.get("/expenses/:id", expenseController.getExpense);

router.delete(
  "/expenses/delete/:id",
  userAuthenticate.authenticate,
  expenseController.deleteExpense
);

router.get(
  "/payment/membership",
  userAuthenticate.authenticate,
  expenseController.isPremium
);

router.get(
  "/users/premiumusers/expenses/:id",
  expenseController.getPremiumUsersExpenses
);

module.exports = router;
