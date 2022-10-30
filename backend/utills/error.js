const handlerServerError = (error, res, statusCode, message) => {
  console.log(error);
  res.status(statusCode).json(message);
};

module.exports = handlerServerError;
