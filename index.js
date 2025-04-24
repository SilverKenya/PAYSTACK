// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const axios = require('axios');

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = require('./path-to-your-serviceAccountKey.json'); // Replace with the path to your Firebase service account JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<your-database-name>.firebaseio.com' // Replace with your Firebase Realtime Database URL
});

// Set up Express application
const app = express();
const port = 3000;

// Use bodyParser middleware to parse incoming request bodies
app.use(bodyParser.json());

// Initialize Firebase Realtime Database reference
const db = admin.database();

// Function to send payment success data to Firebase Realtime Database
const handlePaymentSuccess = (paymentData) => {
  const paystackRef = db.ref('Paystackdata/payment_status');
  
  paystackRef.push({
    status: 'success',
    payment_id: paymentData.id,
    amount: paymentData.amount,
    time: paymentData.created_at,
    message: 'Payment Successful',
    user: paymentData.customer.email,
    // Add other relevant data
  }).then(() => {
    console.log('Payment Success Data Saved to Firebase');
  }).catch((error) => {
    console.error('Error saving payment success data:', error);
  });
};

// Function to send payment declined data to Firebase Realtime Database
const handlePaymentDeclined = (paymentData) => {
  const paystackRef = db.ref('Paystackdata/payment_status');
  
  paystackRef.push({
    status: 'declined',
    payment_id: paymentData.id,
    amount: paymentData.amount,
    time: paymentData.created_at,
    message: 'Payment Declined',
    user: paymentData.customer.email,
    // Add other relevant data
  }).then(() => {
    console.log('Payment Declined Data Saved to Firebase');
  }).catch((error) => {
    console.error('Error saving payment declined data:', error);
  });
};

// Function to send STK sent status to Firebase Realtime Database
const handleStkSent = (stkData) => {
  const paystackRef = db.ref('Paystackdata/payment_status');
  
  paystackRef.push({
    status: 'stk_sent',
    transaction_id: stkData.transaction_id,
    phone_number: stkData.phone_number,
    amount: stkData.amount,
    time: new Date().toISOString(),
    message: 'STK request sent',
    // Add other relevant data
  }).then(() => {
    console.log('STK Sent Data Saved to Firebase');
  }).catch((error) => {
    console.error('Error saving STK sent data:', error);
  });
};

// Handle Paystack payment success callback
app.post('/paystack/success', (req, res) => {
  const paymentData = req.body; // Assuming Paystack sends payment data in the body
  
  if (paymentData.status === 'success') {
    handlePaymentSuccess(paymentData);
    res.status(200).send('Payment Success');
  } else {
    res.status(400).send('Payment Failed');
  }
});

// Handle Paystack payment declined callback
app.post('/paystack/failed', (req, res) => {
  const paymentData = req.body;
  
  if (paymentData.status === 'failed') {
    handlePaymentDeclined(paymentData);
    res.status(200).send('Payment Failed');
  } else {
    res.status(400).send('Unexpected Payment Status');
  }
});

// Handle STK sent callback (for M-Pesa or similar)
app.post('/stk/sent', (req, res) => {
  const stkData = req.body; // Assuming STK data is in the body
  
  if (stkData.status === 'sent') {
    handleStkSent(stkData);
    res.status(200).send('STK Sent');
  } else {
    res.status(400).send('STK Error');
  }
});

// Example: Endpoint to test if the server is working
app.get('/', (req, res) => {
  res.send('Hello, Paystack Integration!');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



