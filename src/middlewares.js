const { requestAuthToken } = require('@sentinel-hub/sentinelhub-js');

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

const authMiddleware = async (req, res, next) => {
  try {
    const clientId = process.env.id;
    const clientSecret = process.env.secret;
    const authToken = await requestAuthToken(clientId, clientSecret);
    req.authToken = authToken;
    next();
  } catch (err) {
    console.log('An error occurred', err.message);
    res.status(500);
  }
};

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
}

module.exports = {
  notFound,
  errorHandler,
  authMiddleware,
};
