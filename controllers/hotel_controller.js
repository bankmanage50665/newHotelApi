const { validationResult } = require("express-validator");
const HttpError = require("../middleware/HttpError");
const Hotel = require("../model/hotel_model");
const { default: mongoose } = require("mongoose");
const User = require("../model/user_model");
const fs = require("fs");

async function addHotle(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return next(new HttpError("Invalid inputs", 422));
  }

  const imgPath = req.files.map((files) => files.path);

  const {
    name,
    address,
    price,
    phone,
    creator,
    bookedBy,
    type,
    images = imgPath,
    status = "Unbooked",
  } = req.body;

  const createHoteses = new Hotel({
    name,
    address,
    price,
    bookedBy,
    phone,
    images,
    creator,
    type,
    status,
    bookingId: [],
  });

  const findCreator = await User.findById(creator);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createHoteses.save({ session: sess });
    findCreator.createdRooms.push(createHoteses);
    await findCreator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Field to create hoteles.", 500));
  }

  res.json({
    message: "Hoteles added sucessfully.",
    hoteles: createHoteses,
  });
}

async function getHotelesList(req, res, next) {
  let hoteles;
  try {
    hoteles = await Hotel.find().sort({ createdAt: -1 });
  } catch (err) {
    return next(new HttpError("Field to find list of hoteles.", 500));
  }

  res.json({
    message: "Fetch hoteleslist sucessfully.",
    hoteles: hoteles.map((hoteles) => hoteles.toObject({ getters: true })),
  });
}

async function hotelById(req, res, next) {
  const hotelId = req.params.id;

  let findHotelById;
  try {
    findHotelById = await Hotel.findById(hotelId);
  } catch (err) {
    return next(
      new HttpError("Field to find hotel , Please try again later.", 500)
    );
  }

  if (!findHotelById) {
    return next(new HttpError("We couldn't find "));
  }

  return res.json({
    message: "Hoteles find sucessfully by id.",
    hotel: findHotelById.toObject({ getters: true }),
  });
}

async function updateHotel(req, res, next) {
  const hotelId = req.params.id;

  if (!hotelId) {
    return new HttpError("Hotel id is required", 400);
  }

  const { name, address, price, phone, type, status } = req.body;

  const imgPath = req.files.map((img) => img.path);

  const findHotelById = await Hotel.findById(hotelId);

  if (!findHotelById) {
    return next(new HttpError("Couldn't find hotel for update.", 500));
  }

  findHotelById.name = name;
  findHotelById.address = address;
  findHotelById.price = price;
  findHotelById.phone = phone;
  findHotelById.type = type;
  findHotelById.status = status;
  findHotelById.images = imgPath;

  try {
    await findHotelById.save();
  } catch (err) {
    return next(
      new HttpError("Field to update hotel, Please try again later.", 500)
    );
  }

  res.json({ message: "Hotel update sucessfully.", hotel: findHotelById });
}

async function deleteHotel(req, res, next) {
  const hotelId = req.params.id;
  if (!hotelId) {
    return new HttpError("Hotel id is required", 400);
  }

  let findHotelById;

  try {
    findHotelById = await Hotel.findById(hotelId);
  } catch (err) {
    return next(
      new HttpError(
        "Field to find hotel by id for delete, Please try again later.",
        500
      )
    );
  }

  let user;
  try {
    user = await User.findById(findHotelById.creator);
  } catch (err) {
    return next(
      new HttpError(
        "Field to user for  hotel delete, Please try again later.",
        500
      )
    );
  }

  findHotelById.images.forEach((file) =>
    fs.unlink(file, (err) => {
      console.log(err);
    })
  );

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await findHotelById.deleteOne({ session: sess });
    user.createdRooms.pull(findHotelById.id);
    await user.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError(
        "Field to delete hotel or cancel booking, Please try again later.",
        500
      )
    );
  }

  res.json({ message: "Hotel delete sucessfully.", hotel: findHotelById });
}



module.exports = {
  addHotle,
  getHotelesList,
  hotelById,
  updateHotel,
  deleteHotel,
};
