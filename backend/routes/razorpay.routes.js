const express = require('express');
const router = express.Router();
const {
  createOrder,
  validatePayment,
} = require('../controllers/razorpay.controller');

router.post('/order', createOrder);
router.post('/order/validate', validatePayment);

module.exports = router;
