const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(express.json());

//Routes
const userRouter = require("./routes/users");
const expenseRouter = require("./routes/expenses");
const purchaseRouter = require("./routes/purchase");
const forgotRouter = require("./routes/forgot");

app.use("/purchase", purchaseRouter);
app.use("/users", userRouter);
app.use(expenseRouter);
app.use("/password", forgotRouter);

mongoose
  .connect(
    "mongodb+srv://praveen:Prawin10@cluster0.cdcefpk.mongodb.net/?retryWrites=true&w=majority"
    // "mongodb://localhost:27017/expenses"
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("server started");
    });
  });
