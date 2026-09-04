const mongoose = require('mongoose');
const { sendError } = require('../utils/apiResponse');
const { isDbConnected } = require('../config/db');

function requireDatabase(req, res, next) {
  if (!isDbConnected()) {
    return sendError(res, 'Unable to load resources. Please try again.', 503);
  }
  return next();
}

function notFound(req, res) {
  return sendError(res, 'We could not find that page.', 404);
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === 'CastError' || err.kind === 'ObjectId') {
    return sendError(res, 'We could not find that resource.', 404);
  }

  if (err.name === 'ValidationError') {
    return sendError(res, 'Please check the resource details and try again.', 400);
  }

  const status = err.status || 500;
  const message =
    status >= 500
      ? 'Something went wrong. Please try again.'
      : err.publicMessage || err.message || 'Unable to complete that request.';

  return sendError(res, message, status);
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);
}

module.exports = {
  requireDatabase,
  notFound,
  errorHandler,
  isValidObjectId,
};
