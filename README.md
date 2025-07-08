
# 💳 Razorpay Payment App (React Native + Node.js + MySQL)

A full-stack mobile app to accept Razorpay payments using React Native WebView, with secure backend integration and MySQL logging.

---

## 📦 Tech Stack

| Layer       | Technology           |
| ----------- | -------------------- |
| Frontend    | React Native (Expo)  |
| Backend     | Node.js + Express    |
| Database    | MySQL                |
| Payment API | Razorpay (Test Mode) |

---

## 📱 Features

* 🔘 Select payment method (Razorpay UPI)
* 🧾 Create Razorpay orders from backend
* 🌐 Display Razorpay payment screen using WebView
* ✅ Verify payment signature securely in backend
* 🗃 Store order & payment logs in MySQL

---

## 🛠️ Setup Instructions

### 1️⃣ Backend (Node.js + Razorpay)

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
RAZORPAY_KEY_ID=rzp_test_YourKeyHere
RAZORPAY_KEY_SECRET=your_secret_here

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=razorpay_db
```

Create DB:

```sql
CREATE DATABASE IF NOT EXISTS razorpay_db;

USE razorpay_db;

CREATE TABLE order_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature VARCHAR(255),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Run backend:

```bash
node index.js
```

---

### 2️⃣ Frontend (React Native Expo)

```bash
cd frontend
npx expo install axios react-native-webview
npx expo start
```

> 🔁 Make sure your backend IP (`http://192.168.x.x:5000`) is accessible on your mobile device.

---

## 🚀 TODO / Future Features

* [ ] Add PhonePe / Google Pay UPI intent
* [ ] Admin dashboard for viewing logs
* [ ] User login / tokenized session
* [ ] Payment history screen (frontend)

---

## 📚 Resources

* [Razorpay Docs](https://razorpay.com/docs/)
* [React Native WebView](https://github.com/react-native-webview/react-native-webview)
* [MySQL](https://dev.mysql.com/doc/)

---

## 📄 License

This project is free to use and does not contain any license.
