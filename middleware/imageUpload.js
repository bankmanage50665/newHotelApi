const multer = require("multer");
const uuid = require("uuid").v4;

const MIME_TYPE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/avif": "avif",
  "image/jfif": "jfif",
};

const fileUpload = multer({
  limits: 50000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE[file.mimetype];
      cb(null, uuid() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE[file.mimetype];
    const err = isValid ? null : new Error("Invlaid mimetype.");
    cb(err, isValid);
  },
});

module.exports = fileUpload;
