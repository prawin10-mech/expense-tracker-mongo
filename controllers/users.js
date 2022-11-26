const jwt = require("jsonwebtoken");

//models
const User = require("../models/users");

//encrypting the password
const Bcrypt = require("bcrypt");

//add users
exports.postUser = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const saltRounds = 10;
    Bcrypt.hash(password, saltRounds, async (err, hash) => {
      console.log(err);
      const user = await User.create({
        name: name,
        email: email,
        password: hash,
      });
      res.status(200).json(user);
    });
  } catch (err) {
    console.log("object");
    res.status(400).send("User Already Exist");
  }
};

//get all the users from the database
exports.getUsers = (req, res, next) => {
  const user = User.findAll().then((data) => {
    res.json(data);
  });
};

function generateJwtToken(id, email) {
  return jwt.sign(
    { userId: id, email: email },
    "989qDQCRetvcc84c982ae4tb45uf78f7qnm67928aim56unsb5ye24f98qf4"
  );
}

//check login details
exports.postlogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findAll({ where: { email: email } });
    Bcrypt.compare(password, user[0].password, (err, result) => {
      if (err) {
        console.log(err);
        res.json({ success: false, message: "Something went wrong" });
      }
      if (result) {
        res.send({
          success: true,
          message:
            "you have logged in successfully please wait until it redirects",
          token: generateJwtToken(user[0].id, user[0].email),
        });
      } else {
        res.json({
          success: false,
          message: "your password was incorrect",
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.json({ message: "User Not found Please Try to login" });
  }
};
