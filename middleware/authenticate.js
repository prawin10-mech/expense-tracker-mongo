const jwt = require("jsonwebtoken");

const mongodb = require("mongodb");
const User = require("../models/users");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const userToken = jwt.verify(
      token,
      "989qDQCRetvcc84c982ae4tb45uf78f7qnm67928aim56unsb5ye24f98qf4"
    );

    const user = await User.find({
      _id: new mongodb.ObjectId(userToken.userId),
    });
    req.user = user[0];
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false });
  }
};
