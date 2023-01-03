const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderId: { type: String },
  paymentId: { type: String },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: { type: String, required: true },
});

module.exports = mongoose.model("Order", orderSchema);

// const Order = sequelize.define("order", {
//   id: {
//     type: Sequelize.INTEGER,

//     allowNull: false,
//     primaryKey: true,
//   },
//   paymentId: Sequelize.STRING,
//   orderId: Sequelize.STRING,
//   status: Sequelize.STRING,
// });

// module.exports = Order;
