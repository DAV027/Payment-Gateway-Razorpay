const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
const razorpayRoutes = require('./routes/razorpay.routes');
app.use('/', razorpayRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
