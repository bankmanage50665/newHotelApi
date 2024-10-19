const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const fileUpload = require("../middleware/imageUpload");

const hotelController = require("../controllers/hotel_controller");
const authCheck = require("../middleware/auth_check");

router.get("/hotelesList", hotelController.getHotelesList);
router.get("/:id", hotelController.hotelById);

router.use(authCheck);
router.post(
  "/add",
  fileUpload.array("images"),
  [
    check("name").not().isEmpty(),
    check("address").isLength(
      { min: 5 },
      check("price").not().isEmpty(),
      check("phone").isLength({ min: 10 }),
      check("images").not().isEmpty(),
      check("type").not().isEmpty()
    ),
  ],
  hotelController.addHotle
);

router.patch("/:id", fileUpload.array("images"), hotelController.updateHotel);
router.delete("/:id", hotelController.deleteHotel);

module.exports = router;
