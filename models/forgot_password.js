const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
  active: { type: Boolean },
  expiresby: { type: Date },
  userId: { type: Schema.Types.ObjectId },
});

module.exports = mongoose.model("Forgot", forgotPasswordSchema);

// const forgotPassowrd = sequelize.define("forgot_password", {
//   id: {
//     type: Sequelize.UUID,
//     allowNull: false,
//     primaryKey: true,
//   },
//   active: Sequelize.BOOLEAN,
//   expiresby: Sequelize.DATE,
// });

// module.exports = forgotPassowrd;
