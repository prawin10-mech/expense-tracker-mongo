const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expenses");

router.post("/expenses", expenseController.postExpenses);

router.get("/expenses", expenseController.getExpenses);

router.get("/expenses/:id", expenseController.getExpense);

router.delete("/expenses/delete/:id", expenseController.deleteExpense);
module.exports = router;
