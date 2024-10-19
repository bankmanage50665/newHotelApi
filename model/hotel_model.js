const mongoose = require("mongoose");
const { Schema } = mongoose;

const hotelSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: Array, required: true },
    phone: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    bookingId: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
