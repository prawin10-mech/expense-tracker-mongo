const Expense = require("../models/expenses");
const FileDownload = require("../models/downloadedFiles");

const UserServices = require("../services/userServices");
const S3Services = require("../services/S3services");

exports.postExpenses = async (req, res, next) => {
  try {
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
  } catch (err) {
    console.log(err);
  }
};

exports.getExpenses = async (req, res, next) => {
  const id = req.user.id;
  const exp = await Expense.findAll({ where: { userId: id } });
  res.json(exp);
};

exports.isPremium = (req, res) => {
  try {
    const isPremium = req.user.isPremiumUser;
    res.status(200).send(isPremium);
  } catch (err) {
    console.log(err);
  }
};

exports.getExpense = (req, res, next) => {
  try {
    const id = req.params.id;
    Expense.findAll({ where: { id: id } }).then((result) => {
      res.status(200).send(result);
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteExpense = (req, res, next) => {
  try {
    const expenseId = req.params.id;
    Expense.destroy({ where: { id: expenseId, userId: req.user.id } }).then(
      () => {
        res.status(200);
      }
    );
  } catch (err) {
    console.log(err);
  }
};

exports.getPremiumUsersExpenses = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    console.log("premiumUser", id);
    Expense.findAll({ where: { userId: id } }).then((result) => {
      res.json(result);
    });
  } catch (err) {
    console.log(err);
  }
};

exports.downloadExpenses = async (req, res) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `expenses${req.user.id}/${new Date()}.txt`;
    const fileURL = "https://www.google.com";
    await FileDownload.create({
      fileURL: fileURL,
    });
    let date = new Date().getTime();
    res.status(200).json({ fileURL, success: true, date: date });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileURL: "", success: false });
  }
};

let limit = 5;
exports.getAddPages = (req, res, next) => {
  const page = req.query.page;
  const userId = req.user.id;
  return Expense.findAll({
    where: { userId: userId },
    limit: limit,
    offset: limit * page,
  }).then((result) => {
    res.json(result);
  });
};
