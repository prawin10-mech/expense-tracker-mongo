const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const sequelize = require("./util/database");

const userRouter = require("./routes/users");
const expenseRouter = require("./routes/expenses");

app.use(express.json());
app.use("/users", userRouter);
app.use(expenseRouter);

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
