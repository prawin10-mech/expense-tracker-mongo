const express = require("express");

const purchaseController = require("../controllers/payments");

const userAuthenticate = require("../middleware/authenticate");

const router = express.Router();

router.get(
  "/premiummembership",
  userAuthenticate.authenticate,
  purchaseController.premiumMembership
);

router.post(
  "/updatetransactionstatus",
  userAuthenticate.authenticate,
  purchaseController.updateTransactionStatus
);

module.exports = router;
