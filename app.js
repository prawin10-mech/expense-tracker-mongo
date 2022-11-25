const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json({ extended: false }));
app.use(cors());

const sequelize = require("./util/database");
const userRouter = require("./routes/users/users");
app.use(userRouter);

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
