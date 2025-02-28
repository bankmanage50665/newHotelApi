const { validationResult } = require("express-validator");

const Review = require("../model/review_modal");
const HttpError = require("../utils/errorModal");

async function createReview(req, res, next) {
  const err = validationResult(req);

  if (!err.isEmpty) {
    return next("Invalid user credintials.", 500);
  }

  const { userName, productId, rating, comment } = req.body;

  const newReview = new Review({
    productId,
    userName,
    rating,
    comment,
    imageUrl: req.files.map((file) => file.path),
  });

  try {
    await newReview.save();
  } catch (err) {
    return next(
      new HttpError("Field to create review, Please try again later.", 500)
    );
  }
  res
    .status(201)
    .json({ message: "Review added sucessfully.", review: newReview });
}

async function getReviewByProductId(req, res, next) {
  const productId = req.params.id;

  if (!productId) {
    return next("Couldn't find productid.", 500);
  }

  let review;

  try {
    review = await Review.find({ productId }).sort({ createdAt: -1 });
  } catch (err) {
    return next(
      new HttpError("Field to get user review, Please try again later.", 500)
    );
  }

  res.json({
    message: "Find product review sucessfully",
    review: review.map((review) => review.toObject({ getters: true })),
  });
}

module.exports = { createReview, getReviewByProductId };
