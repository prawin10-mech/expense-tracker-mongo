const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Expenses = sequelize.define("expenses", {
  money: Sequelize.STRING,
  description: Sequelize.STRING,
  category: Sequelize.STRING,
});

module.exports = Expenses;
