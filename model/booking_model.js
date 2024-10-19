// models/Booking.js
const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    hotelId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Hotel",
    },
    userName: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    numberOfGuests: { type: Number, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Pending" }, // e.g., 'pending', 'confirmed', 'canceled'
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
