const jwt = require("jsonwebtoken");

//models
const User = require("../models/users");

const mongodb = require("mongodb");
//encrypting the password
const Bcrypt = require("bcrypt");

//add users
exports.postUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const saltRounds = 10;
    Bcrypt.hash(password, saltRounds, async (err, hash) => {
      const user = new User({
        name,
        email,
        password: hash,
        isPremiumUser: false,
      });
      user.save().then(() => {
        console.log("user created");
        res.status(200).json(user);
      });
    });
  } catch (err) {
    console.log("object");
    res.status(400).send("User Already Exist");
  }
};

//get all the users from the database
exports.getUsers = (req, res, next) => {
  User.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
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
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    Bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.json({ success: false, message: "Something went wrong" });
      }
      if (result) {
        res.send({
          success: true,
          message:
            "you have logged in successfully please wait until it redirects",
          token: generateJwtToken(user._id, user.email),
        });
      } else {
        res.json({
          success: false,
          message: "your password was incorrect",
        });
      }
    });
  } catch (err) {
    res.json({ message: "User Not found Please Try to login" });
  }
};

exports.getUser = async (req, res, next) => {
  const id = req.params.id;
  const userDetails = await User.find({ _id: new mongodb.ObjectId(id) });
  res.json(userDetails);
};

exports.getPremiumUsers = (req, res, next) => {
  User.find({ isPremiumUser: true }).then((result) => {
    res.json(result);
  });
};
