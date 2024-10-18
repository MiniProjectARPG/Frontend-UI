const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Razorpay instance with your test keys
const razorpay = new Razorpay({
    key_id: 'rzp_test_B7oDoeCewt5dgr',  // Replace with Razorpay test key ID
    key_secret: '28Ddxgj7iMYCMosrSi8jJxEu',  // Replace with Razorpay test key secret
});

// Dummy user data for PIN authentication
const userPinData = {
    'user123': '1234',  // Replace with actual users and hashed pins
};

// Endpoint to create payout
app.post('/create-payout', async (req, res) => {
    const { amount, merchant_id, user_id, pin } = req.body;

    // Check if the PIN is correct
    if (userPinData[user_id] !== pin) {
        return res.json({ status: 'error', message: 'Invalid PIN' });
    }

    try {
        // Create payout using Razorpay API
        const payout = await razorpay.payouts.create({
            account_number: '232323XXXXXX',  // Razorpay virtual account number
            amount: amount * 100,  // Amount in paisa
            currency: 'INR',
            notes: {
                purpose: 'Payout to merchant',
            },
            fund_account: {
                account_type: 'merchant_id',
                merchant_id:P9HuxdtxrwOkkp,
            },
            mode: 'UPI',
            queue_if_low_balance: true,
        });

        res.json({
            status: 'success',
            payout_id: payout.id,
            amount: payout.amount,
        });
    } catch (error) {
        console.error('Error creating payout:', error);
        res.json({ status: 'error', message: 'Payout creation failed' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
