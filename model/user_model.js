const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  phoneNumber: { type: Number, required: true },
  otp: { type: String, required: false },
  otpExpiration: { type: Date, required: false },

  bookedRooms: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
  createdRooms: [{ type: mongoose.Types.ObjectId, ref: "Hotel" }],
}, {timestamps: true});

const User = mongoose.model("User", userSchema);
module.exports = User;
