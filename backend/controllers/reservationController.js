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

// ===== UPDATE RESERVATION STATUS =====
// PUT /api/reservations/:id
const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: pending, confirmed, cancelled, or completed.',
            });
        }

        const reservation = await Reservation.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found',
            });
        }

        res.status(200).json({
            success: true,
            message: `Reservation ${status} successfully`,
            reservation,
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// ===== DELETE RESERVATION =====
// DELETE /api/reservations/:id
const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findByIdAndDelete(id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Reservation deleted successfully',
        });
    } catch (error) {
        console.error('Delete reservation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

module.exports = {
    createReservation,
    getAllReservations,
    updateReservationStatus,
    deleteReservation,
};