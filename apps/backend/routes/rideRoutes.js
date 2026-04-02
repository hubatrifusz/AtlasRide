import { validate } from '../middleware/validateForm';

const express = require('express');
const Booking = require('../models/Booking');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', validate(Booking), async (req, res, next) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/health-check', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ message: 'Health check booking created successfully' });
  } catch (err) {
    console.error('❌ Health check booking error:', err);
  }
});

module.exports = router;
