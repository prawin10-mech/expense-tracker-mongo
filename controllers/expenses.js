const Expense = require("../models/expenses");
const FileDownload = require("../models/downloadedFiles");

const UserServices = require("../services/userServices");
const S3Services = require("../services/S3services");

const mongodb = require("mongodb");

exports.postExpenses = async (req, res, next) => {
  try {
    const { money, description, category } = req.body;
    const expense = new Expense({
      money,
      description,
      category,
      userId: req.user._id,
    });
    expense.save().then(() => {
      res.status(200).json(expense);
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getExpenses = async (req, res, next) => {
  const id = req.user._id;
  console.log("object", id);
  Expense.find({ userId: id }).then((exp) => {
    res.json(exp);
  });
};

exports.isPremium = (req, res) => {
  try {
    const isPremium = req.user.isPremiumUser;
    console.log(isPremium);
    res.status(200).send(isPremium);
  } catch (err) {
    console.log(err);
  }
};

exports.getExpense = (req, res, next) => {
  try {
    const id = req.params.id;
    Expense.find({ _id: id }).then((result) => {
      res.status(200).send(result);
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteExpense = (req, res, next) => {
  try {
    const expenseId = new mongodb.ObjectId(req.params.id);
    Expense.findByIdAndDelete({
      _id: expenseId,
      userId: req.user._id,
    }).then((result) => {
      res.json({ success: true });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getPremiumUsersExpenses = async (req, res, next) => {
  try {
    const id = new mongodb.ObjectId(req.params.id);
    Expense.find({ userId: id }).then((result) => {
      console.log("hello", result);
      res.json(result);
    });
  } catch (err) {
    console.log(err);
  }
};

//let row = 7;
exports.getAddPages = (req, res, next) => {
  let row = +req.query.rows;

  const page = +req.query.page;
  const userId = req.user.id;
  return Expense.find({ userId: userId })
    .limit(row)
    .skip(row * page)
    .exec()
    .then((result) => {
      res.json(result);
    });
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
