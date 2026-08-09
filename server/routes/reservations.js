const express = require('express');
const Reservation = require('../models/Reservation');
const { validateReservation } = require('../middleware/validation');

const router = express.Router();

// POST /api/reservations - Create new reservation
router.post('/', validateReservation, async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, specialRequests } = req.body;

    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    const reservation = await Reservation.create({
      name,
      email,
      phone,
      date,
      time,
      guests: parseInt(guests),
      specialRequests: specialRequests || '',
      status: 'pending',
    });

    res.status(201).json({ 
      message: 'Reservation submitted successfully! We will contact you soon.',
      reservation 
    });
  } catch (err) {
    console.error('Reservation creation error:', err);
    res.status(500).json({ error: 'Failed to create reservation.' });
  }
});

module.exports = router;
