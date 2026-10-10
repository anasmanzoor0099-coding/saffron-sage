/* ============================================
   SAFFRON & SAGE — Backend Server
   Node.js + Express + MongoDB
   ============================================ */

// ===== IMPORTS =====
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const reservationRoutes = require('./routes/reservation');
require('dotenv').config();

// ===== APP SETUP =====
const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== API ROUTES =====
app.use('/api/reservations', reservationRoutes);

// ===== TEST ROUTES =====
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🍽️ Saffron & Sage API is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// ===== START SERVER =====
async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log('');
        console.log('╔════════════════════════════════════════╗');
        console.log('║   🍽️  Saffron & Sage Backend           ║');
        console.log('╠════════════════════════════════════════╣');
        console.log(`║   ✅ Running on: http://localhost:${PORT} ║`);
        console.log(`║   🌍 Environment: ${process.env.NODE_ENV}      ║`);
        console.log('╚════════════════════════════════════════╝');
        console.log('');
    });
}

startServer();