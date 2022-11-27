const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const sequelize = require("./util/database");

const purchaseRoutes = require("./routes/purchase");
const userRouter = require("./routes/users");
const expenseRouter = require("./routes/expenses");

app.use(express.json());
app.use("/purchase", purchaseRoutes);
app.use("/users", userRouter);
app.use(expenseRouter);

const Order = require("./models/orders");
const User = require("./models/users");
const Expense = require("./models/expenses");

//associations
Expense.belongsTo(User);
User.hasMany(Expense);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
  .sync()
  .then(
    app.listen(3000, () => {
      console.log("server started");
    })
  )
  .catch((err) => {
    console.log(err);
  });
