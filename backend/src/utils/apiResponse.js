function success(res, data, meta = {}, status = 200) {
  return res.status(status).json({
    success: true,
    data,
    meta,
  });
}

function failure(res, message, status = 400, errors = null) {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
}

module.exports = { success, failure };
