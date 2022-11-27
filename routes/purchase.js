const express = require("express");

const purchaseController = require("../controllers/payments");

const authenticatemiddleware = require("../middleware/authenticate");

const router = express.Router();

router.get(
  "/premiummembership",
  authenticatemiddleware.authenticate,
  purchaseController.premiumMembership
);

router.post(
  "/updatetransactionstatus",
  authenticatemiddleware.authenticate,
  purchaseController.updateTransactionStatus
);

module.exports = router;
