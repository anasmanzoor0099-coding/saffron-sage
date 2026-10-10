/* ============================================
   RESERVATION MODEL — Saffron & Sage
   ============================================ */

const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please provide a valid email',
            ],
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            trim: true,
        },
        date: {
            type: String,
            required: [true, 'Date is required'],
        },
        time: {
            type: String,
            required: [true, 'Time is required'],
        },
        guests: {
            type: Number,
            required: [true, 'Number of guests is required'],
            min: [1, 'At least 1 guest required'],
            max: [20, 'For parties larger than 20, please call us'],
        },
        occasion: {
            type: String,
            enum: ['', 'Birthday', 'Anniversary', 'Business', 'Date Night', 'Other'],
            default: '',
        },
        specialRequests: {
            type: String,
            trim: true,
            maxlength: [500, 'Special requests cannot exceed 500 characters'],
            default: '',
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'confirmed',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Reservation', reservationSchema);