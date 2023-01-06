const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isPremiumUser: { type: Boolean, required: true },
});

module.exports = mongoose.model("User", userSchema);

// const User = sequelize.define("user", {
//   name: Sequelize.STRING,
//   email: {
//     type: Sequelize.STRING,
//     unique: true,
//   },
//   password: Sequelize.STRING,
//   isPremiumUser: Sequelize.BOOLEAN,
// });

// module.exports = User;
