const { createOrder, validateSignature } = require('../services/razorpay.service');
const { insertOrderLog } = require('../models/OrderLog');

exports.createOrder = async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await createOrder(amount);
    await insertOrderLog({
      orderId: order.id,
      paymentId: null,
      signature: null,
      status: 'CREATED',
    });

    res.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error('Order Creation Error:', err);
    res.status(500).json({ success: false });
  }
};

exports.validatePayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const isValid = validateSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    const status = isValid ? 'VERIFIED' : 'INVALID';

    await insertOrderLog({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status,
    });

    res.json({ success: isValid });
  } catch (err) {
    console.error('Validation Error:', err);
    res.status(500).json({ success: false });
  }
};
