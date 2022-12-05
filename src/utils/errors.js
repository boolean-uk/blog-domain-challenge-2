class MissingFieldsError extends Error {
    message = "Missing fields in request body";
    code = 400;
  }

class CantFindIdError extends Error {
    message = "Could not find record";
    code = 404;
  }

class WrongPasswordError extends Error {
    message = "Wrong username or password";
    code = 403;
  }
class InvalidTokenError extends Error {
    message = "Invalid token";
    code = 498;
  }

class UnauthorizedError extends Error {
    message = "Unauthorized";
    code = 401;
  }
  
  module.exports = { MissingFieldsError, CantFindIdError, WrongPasswordError, InvalidTokenError, UnauthorizedError };