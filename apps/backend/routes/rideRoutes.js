const express = require("express");
const Booking = require("../models/Booking");
const sendBookingEmail = require("../utils/sendEmail");

const router = express.Router();

// GET ALL bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Create a new booking and send confirmation email
router.post("/", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();

    // Try to send emails, but don't fail the booking if email fails
    try {
      await sendBookingEmail(savedBooking);
    } catch (emailError) {
      console.error("⚠️  Booking saved but email failed:", emailError.message);
      // Continue anyway - booking is saved
    }

    res.status(201).json(savedBooking);
  } catch (err) {
    console.error("❌ Booking error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
