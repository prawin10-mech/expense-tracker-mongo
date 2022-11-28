const Razorpay = require("razorpay");
const Order = require("../models/orders");

const premiumMembership = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 599;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      console.log(order);
      if (err) {
        throw new Error(err);
      }
      req.user
        .createOrder({ orderId: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Sometghing went wrong", error: err });
  }
};

const updateTransactionStatus = (req, res) => {
  try {
    const { payment_id, order_id } = req.body;
    Order.findOne({ where: { orderId: order_id } })
      .then((order) => {
        console.log(order);
        order
          .update({ paymentId: payment_id, status: "SUCCESSFUL" })
          .then(() => {
            req.user.update({ isPremiumUser: true });
            return res
              .status(202)
              .json({ sucess: true, message: "Transaction Successful" });
          })
          .catch((err) => {
            throw new Error(err);
          });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ errpr: err, message: "Sometghing went wrong" });
  }
};

module.exports = {
  premiumMembership,
  updateTransactionStatus,
};
