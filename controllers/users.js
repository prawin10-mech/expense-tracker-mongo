const User = require("../models/users");

//add users
exports.postUser = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });
    res.status(200).json(user);
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

exports.getLogin = (req, res, next) => {
  try {
    const email = req.params.email;
    User.findAll({ where: { email: email } })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log("object");
    res.status(400).send("User Already Exist");
  }
};
