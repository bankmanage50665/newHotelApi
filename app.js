require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const bookingRouter = require("./routes/booking_routes.js");
const hotelRoutes = require("./routes/hotel_routes.js");
const HttpError = require("./middleware/HttpError");
const otpRoute = require("./routes/user_routes.js");

const url = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluster0.wdrbduw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "https://hotelbookingfrontend-56f87.web.app", // Add both production and local URLs
    // origin: "http://localhost:3001", // Add both production and local URLs
    credentials: true,
  })
);

app.use("/otp", otpRoute);
app.use("/hoteles", hotelRoutes);
app.use("/bookings", bookingRouter);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.files.forEach((file) => file.path));
  }

  if (res.headerSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.json({
    message: err.message || "Something went wrong, Please try again later.",
  });
});

const port = process.env.PORT || 3000;

mongoose
  .connect(url)
  .then((req, res) => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(port);
    console.log(err);
  });
