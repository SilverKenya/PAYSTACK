const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PAYSTACK_SECRET_KEY = 'sk_live_5ec668e68cab5e44f88bb1e3aa2edfb43eb0dcca'; // Replace with new one after testing

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

const PORT = 5000;
app.listen(PORT, () => console.log(`Paystack MPESA server running on http://localhost:${PORT}`));
