const express = require("express");
const Booking = require("../models/Booking");
const nodemailer = require("nodemailer");
const sendBookingEmail = require("../utils/sendEmail");

const router = express.Router();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.rackhost.hu",
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

    // Send emails to customer and admin
    await sendBookingEmail(savedBooking);

    res.status(201).json(savedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE ALL bookings
router.delete("/", async (req, res) => {
  try {
    await Booking.deleteMany();
    res.json({ message: "All bookings deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
