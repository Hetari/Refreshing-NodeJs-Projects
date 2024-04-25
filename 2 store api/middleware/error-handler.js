const errorHandlerMiddleware = async (err, req, res, next) => {
  return res
    .status(500)
    .json({ msg: err.message || 'Something went wrong, try again later' });
};

export { errorHandlerMiddleware };
