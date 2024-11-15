const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  hotelId: String,
  userName: String,
  rating: Number,
  comment: String,
  imageUrl: { type: Array, requird: true },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
