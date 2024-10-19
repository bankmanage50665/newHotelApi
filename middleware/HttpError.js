class HttpError extends Error {
    constructor(message, errCode) {
      super(message), (this.errCode = errCode);
    }
  }
  
  module.exports = HttpError;
  