const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Use the Paystack Secret Key from environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY; // This will read from the environment variable

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/pay/mpesa', async (req, res) => {
  const { email, amount, phone } = req.body;

  try {
    console.log(phone, amount);
    const response = await axios.post(
      'https://api.paystack.co/charge',
      {
        email,
        amount: amount * 100,
        currency: 'KES',
        mobile_money: {
          phone,
          provider: 'mpesa',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Paystack MPESA server running on http://localhost:${PORT}`));
