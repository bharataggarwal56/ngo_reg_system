const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation');
const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/checkout', async (req, res) => {
    try {
        const { amount, userId } = req.body;

        const options = {
            amount: amount * 100, 
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        const newDonation = new Donation({
            userId,
            amount, 
            paymentId: order.id,
            status: 'pending'
        });

        await newDonation.save();

        res.json({ order, donationId: newDonation._id });

    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/verify', async (req, res) => {
    try {
        if (req.body.status === 'failed') {
            await Donation.findByIdAndUpdate(req.body.donationId, { status: 'failed' });
            return res.json({ status: 'failed' });
        }
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            await Donation.findByIdAndUpdate(donationId, { 
                status: 'success', 
                paymentId: razorpay_payment_id 
            });
            res.json({ status: 'success' });
        } else {
            await Donation.findByIdAndUpdate(donationId, { status: 'failed' });
            res.status(400).json({ status: 'failed' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Verification failed' });
    }
});

router.get('/my-donations/:userId', async (req, res) => {
    try {
        const donations = await Donation.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;