// Import necessary libraries
const express = require('express');
const admin = require('firebase-admin');
require('dotenv').config(); // To load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;  // Default to port 3000 if not specified

// Initialize Firebase Admin SDK using environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newlines in private key
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

// Sample route to verify Firebase connection
app.get('/firebase-status', (req, res) => {
  admin.firestore().collection('status').doc('status').get()
    .then((doc) => {
      if (doc.exists) {
        res.send('Firebase is connected: ' + doc.data().message);
      } else {
        res.send('Firebase is connected, but no status message found.');
      }
    })
    .catch((error) => {
      res.status(500).send('Error getting Firebase document: ' + error.message);
    });
});

// Example of a basic route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

