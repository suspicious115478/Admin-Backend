// admin-backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const adminRoutes = require('./src/routes/adminRoutes');
// Initialize Firebase Admin SDK connection
require('./src/utils/firebaseAdmin'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests from the frontend
app.use(express.json());

// Basic welcome route
app.get('/', (req, res) => {
    res.send('Admin API is running.');
});

// Routes
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});