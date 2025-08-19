const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ApiError') {
    return res.status(err.statusCode).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;