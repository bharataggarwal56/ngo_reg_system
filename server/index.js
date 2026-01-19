const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
dotenv.config();

const app = express();
// const PORT = process.env.PORT || 5000;
const adminRoutes = require('./routes/admin');

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
const paymentRoutes = require('./routes/payment');

app.use('/api/payment', paymentRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((err) => console.error("MongoDB connection error:", err));

app.get('/', (req, res) => {
    res.send('NSS Project Backend is Running');
});

app.use('/api/admin', adminRoutes);
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
const PORT = process.env.PORT || 5000;


if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;