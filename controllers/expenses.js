const Expense = require("../models/expenses");
const AWS = require("aws-sdk");

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

exports.getPremiumUsersExpenses = (req, res, next) => {
  const id = req.params.id;
  Expense.findAll({ where: { userId: id } }).then((result) => {
    res.json(result);
  });
};

function uploadToS3(data, filename) {
  let s3bucket = new AWS.S3({
    accessKeyId: process.env.I_AM_USER_KEY,
    secretAccessKey: process.env.I_AM_USER_SECRET,
  });

  let params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("something went wrong");
        reject(err);
      }
      resolve(s3response.Location);
    });
  });
}

exports.downloadExpenses = async (req, res, next) => {
  const expenses = await req.user.getExpenses();
  const stringifiedExpenses = JSON.stringify(expenses);
  const filename = `expenses${req.user.userId}/${new Date()}.txt`;
  const fileURL = await uploadToS3(stringifiedExpenses, filename);
  res.status(200).json({ fileURL, success: true });
};
