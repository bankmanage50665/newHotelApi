const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const reviewController = require("../../controller/review_controller");
const fileUpload = require("../../utils/imageUpload");

router.post(
  "/create",

  [
    check("userName").not().isEmpty(),
    check("userName").not().isEmpty(),
    check("rating").not().isEmpty(),
    check("comment").not().isEmpty(),
  ],
  fileUpload.array("image", 12),
  reviewController.createReview
);
router.get("/:id", reviewController.getReviewByProductId);

module.exports = router;
