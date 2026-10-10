/* ============================================
   DATABASE CONNECTION — Saffron & Sage
   ============================================ */

const mongoose = require('mongoose');

async function connectDB() {
    try {
        console.log('⏳ Connecting to MongoDB...');

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ MongoDB Connected Successfully!');
        console.log(`📦 Database: ${mongoose.connection.name}`);
        console.log(`🌐 Host: ${mongoose.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB Error:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;