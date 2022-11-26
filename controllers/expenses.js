const Expense = require("../models/expenses");

exports.postExpenses = async (req, res, next) => {
  const money = req.body.money;
  const description = req.body.description;
  const category = req.body.category;
  const expense = await Expense.create({
    money: money,
    description: description,
    category: category,
  });
  res.status(200).json(expense);
};

exports.getExpenses = (req, res, next) => {
  Expense.findAll().then((result) => {
    res.status(200).send(result);
  });
};

exports.getExpense = (req, res, next) => {
  const id = req.params.id;
  Expense.findAll({ where: { id: id } }).then((result) => {
    console.log(result);
    res.status(200).send(result);
  });
};

exports.deleteExpense = (req, res, next) => {
  const expenseId = req.params.id;
  console.log(expenseId);
  Expense.destroy({ where: { id: expenseId } }).then(() => {
    res.status(200);
  });
};
