const Expense = require("../models/expenses");
const FileDownload = require("../models/downloadedFiles");

const UserServices = require("../services/userServices");
const S3Services = require("../services/S3services");

let limit_items = 10;

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
  let page = req.query.page || 1;
  // console.log("/////////////////////////", page);
  try {
    let totalExpenses = await Expense.count({ where: { userId: req.user.id } });
    let expenses = await req.user.getExpenses({
      offset: (page - 1) * limit_items,
      limit: limit_items,
    });

    console.log("////////////////", limit_items);
    res.status(200).json({
      expenses,
      success: true,
      data: {
        currentPage: +page,
        hasNextPage: totalExpenses > page * limit_items,
        hasPreviousPage: page > 1,
        nextPage: +page + 1,
        previousPage: +page - 1,
        lastPage: Math.ceil(totalExpenses / limit_items),
      },
    });
  } catch (err) {
    console.log(err);
  }
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
    const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
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
