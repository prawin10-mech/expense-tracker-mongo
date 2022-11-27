const Expense = require("../models/expenses");

exports.postExpenses = async (req, res, next) => {
  const money = req.body.money;
  const description = req.body.description;
  const category = req.body.category;
  const expense = await Expense.create({
    money: money,
    description: description,
    category: category,
    userId: req.user.id,
  });
  res.status(200).json(expense);
};

exports.getExpenses = (req, res, next) => {
  //Expense.findAll({ where: { userId: req.user.id } }).then((result) => {

  const isPremium = req.user.isPremiumUser;
  console.log(isPremium);
  req.user.getExpenses().then((result) => {
    res.status(200).send(result);
  });
};
exports.isPremium = (req, res) => {
  const isPremium = req.user.isPremiumUser;
  res.status(200).send(isPremium);
};

exports.getExpense = (req, res, next) => {
  const id = req.params.id;
  Expense.findAll({ where: { id: id } }).then((result) => {
    res.status(200).send(result);
  });
};

exports.deleteExpense = (req, res, next) => {
  const expenseId = req.params.id;
  Expense.destroy({ where: { id: expenseId, userId: req.user.id } }).then(
    () => {
      res.status(200);
    }
  );
};
