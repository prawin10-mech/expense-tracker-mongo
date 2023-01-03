const Razorpay = require("razorpay");
const Order = require("../models/orders");
const User = require("../models/users");

const premiumMembership = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 599;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(err);
      }
      console.log(order);
      const orde = new Order({
        userId: req.user._id,
        orderId: order.id,
        status: "PENDING",
      });
      orde.save().then(() => {
        return res.status(201).json({ order, key_id: rzp.key_id });
      });
      // req.user
      //   .createOrder({ orderId: order.id, status: "PENDING" })
      //   .then(() => {
      //     return res.status(201).json({ order, key_id: rzp.key_id });
      //   })
      //   .catch((err) => {
      //     throw new Error(err);
      //   });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Sometghing went wrong", error: err });
  }
};

const updateTransactionStatus = (req, res) => {
  try {
    const { payment_id, order_id } = req.body;
    Order.findOne({ orderId: order_id })
      .then((order) => {
        order
          .updateOne({ paymentId: payment_id, status: "SUCCESSFUL" })
          .then(() => {
            // req.user.updateOne({ isPremiumUser: true });
            const id = req.user._id;
            User.findByIdAndUpdate(
              id,
              { isPremiumUser: true },
              (err, result) => {
                if (err) {
                  console.log(err);
                }
                console.log(result);
              }
            );
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
