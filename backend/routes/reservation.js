/* ============================================
   RESERVATION ROUTES — Saffron & Sage
   /api/reservations
   ============================================ */

const express = require('express');
const router = express.Router();

const {
    createReservation,
    getAllReservations,
    updateReservationStatus,
    deleteReservation,
} = require('../controllers/reservationController');

router.post('/', createReservation);
router.get('/', getAllReservations);
router.put('/:id', updateReservationStatus);
router.delete('/:id', deleteReservation);

module.exports = router;