const express = require('express');
const User = require('../models/User');
const Donation = require('../models/Donation');
const router = express.Router();

router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        
        const donations = await Donation.find({ status: 'success' });
        const totalDonations = donations.reduce((acc, curr) => acc + curr.amount, 0);

        res.json({ totalUsers, totalDonations });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/donations', async (req, res) => {
    try {
        const donations = await Donation.find().populate('userId', 'name email');
        res.json(donations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;