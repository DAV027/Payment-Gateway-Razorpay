const db = require('../config/db');

const insertOrderLog = async ({ orderId, paymentId, signature, status }) => {
  await db.query(
    `INSERT INTO order_logs (razorpay_order_id, razorpay_payment_id, razorpay_signature, status)
     VALUES (?, ?, ?, ?)`,
    [orderId, paymentId, signature, status]
  );
};

module.exports = { insertOrderLog };
