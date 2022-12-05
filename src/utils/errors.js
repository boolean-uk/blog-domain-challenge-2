class MissingFieldsError extends Error {
    message = "Missing fields in request body";
    code = 400;
  }

class CantFindIdError extends Error {
    message = "Could not find record";
    code = 404;
  }

class WrongPasswordError extends Error {
    message = "Wrong password";
    code = 403;
  }
  
  module.exports = { MissingFieldsError, CantFindIdError, WrongPasswordError };