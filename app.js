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
const forgotRouter = require("./routes/forgot");

app.use(express.json());

//Routes
app.use("/purchase", purchaseRoutes);
app.use("/users", userRouter);
app.use(expenseRouter);
app.use("/password", forgotRouter);

//models
const Order = require("./models/orders");
const User = require("./models/users");
const Expense = require("./models/expenses");
const forgotPassword = require("./models/forgot_password");

//associations
Expense.belongsTo(User);
User.hasMany(Expense);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forgotPassword);
forgotPassword.belongsTo(User);

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
