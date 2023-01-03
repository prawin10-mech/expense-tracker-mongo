const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  money: { type: String, require: true },
  description: { type: String, require: true },
  category: {
    type: String,
    require: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Expense", expenseSchema);

// const Expenses = sequelize.define("expenses", {
//   money: Sequelize.STRING,
//   description: Sequelize.STRING,
//   category: Sequelize.STRING,
// });

// module.exports = Expenses;
