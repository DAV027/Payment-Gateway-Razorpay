import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';

const BACKEND_URL = 'http://192.168.29.253:5000';

const paymentMethods = [
  { id: 'razorpay', name: 'Razorpay', icon: '📱' },
];

export default function App() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentHtml, setPaymentHtml] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const webviewRef = useRef();

  const handlePayment = async (method) => {
    setSelectedMethod(method);
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/order`, { amount: 100 });

      if (!res.data.success) {
        Alert.alert('Error', 'Failed to create Razorpay order');
        setLoading(false);
        return;
      }

      const orderId = res.data.orderId;

      const razorpayHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Pay with Razorpay</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </head>
        <body onload="payNow()" style="display:flex;justify-content:center;align-items:center;height:100vh;">
          <script>
            function payNow() {
              var options = {
                key: 'rzp_test_pH2tVLJU3NcLJ6',
                amount: 100,
                currency: 'INR',
                name: 'My App',
                description: 'Test Payment',
                order_id: '${orderId}',
                handler: function (response) {
                  window.ReactNativeWebView.postMessage(JSON.stringify(response));
                },
                prefill: {
                  name: 'Test User',
                  email: 'test@example.com',
                  contact: '9999999999'
                },
                theme: { color: '#3399cc' }
              };
              var rzp = new Razorpay(options);
              rzp.open();
            }
          </script>
        </body>
        </html>
      `;

      setPaymentHtml(razorpayHtml);
      setModalVisible(true);
    } catch (err) {
      Alert.alert('Error', 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (response) => {
    try {
      const data = JSON.parse(response.nativeEvent.data);

      const verifyRes = await axios.post(`${BACKEND_URL}/order/validate`, {
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      });

      if (verifyRes.data.success) {
        Alert.alert('✅ Success', 'Payment verified successfully!');
      } else {
        Alert.alert('⚠️ Verification Failed', verifyRes.data.message || 'Invalid transaction.');
      }
    } catch (error) {
      console.error('Verification Error:', error);
      Alert.alert('❌ Error', 'Could not verify the payment.');
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>

      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodButton,
            selectedMethod?.id === method.id && styles.selected,
          ]}
          onPress={() => handlePayment(method)}
        >
          <Text style={styles.icon}>{method.icon}</Text>
          <Text style={styles.label}>{method.name}</Text>
        </TouchableOpacity>
      ))}

      {loading && <ActivityIndicator size="large" color="#4b5563" style={{ marginTop: 20 }} />}

      <Modal visible={modalVisible} animationType="slide">
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{ html: paymentHtml }}
          onMessage={handleVerifyPayment}
          javaScriptEnabled
          domStorageEnabled
        />
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={{ padding: 20, backgroundColor: '#ef4444' }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}>
            Cancel Payment
          </Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  methodButton: {
    padding: 16,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selected: {
    borderColor: '#4e54c8',
    backgroundColor: '#eef2ff',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  label: {
    fontSize: 18,
  },
});
