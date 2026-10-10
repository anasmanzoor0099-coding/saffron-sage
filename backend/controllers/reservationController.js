/* ============================================
   RESERVATION CONTROLLER — Saffron & Sage
   ============================================ */

const Reservation = require('../models/Reservation');

// ===== CREATE RESERVATION =====
// POST /api/reservations
const createReservation = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            date,
            time,
            guests,
            occasion,
            specialRequests,
        } = req.body;

        // Validation
        if (!name || !email || !phone || !date || !time || !guests) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields',
            });
        }

        // Create reservation
        const reservation = await Reservation.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            date,
            time,
            guests,
            occasion: occasion || '',
            specialRequests: specialRequests || '',
        });

        res.status(201).json({
            success: true,
            message: 'Your table is reserved! We\'ll see you soon.',
            data: {
                id: reservation._id,
                name: reservation.name,
                date: reservation.date,
                time: reservation.time,
                guests: reservation.guests,
            },
        });
    } catch (error) {
        console.error('Reservation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// ===== GET ALL RESERVATIONS (admin) =====
// GET /api/reservations
const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reservations.length,
            reservations,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createReservation,
    getAllReservations,
};