const jwt = require("jsonwebtoken");
const HttpError = require("../middleware/HttpError");

async function auth_check(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return next(new HttpError("Couldn't find token", 401));
    }
    

    const decodedToken =  jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.token };
    
    next();
  } catch (err) {
    return next(new HttpError("Field to varify token.", 500));
  }
}

module.exports = auth_check;
