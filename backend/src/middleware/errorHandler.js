const multer = require('multer');

function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err instanceof multer.MulterError) {
    const fileMessage =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'That file is too large. Please keep uploads to 10MB or less.'
        : 'The file could not be uploaded. Please try a different file.';
    return res.status(400).json({
      success: false,
      message: fileMessage,
      errors: { file: fileMessage },
    });
  }

  if (err.errors && err.status === 400) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Please check the highlighted fields.',
      errors: err.errors,
    });
  }

  if (err.name === 'ValidationError') {
    const errors = Object.fromEntries(
      Object.entries(err.errors || {}).map(([key, value]) => [key, value.message])
    );
    return res.status(400).json({
      success: false,
      message: 'Please check the highlighted fields.',
      errors,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'That identifier is not valid.',
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong. Please try again.',
    errors: err.errors || null,
  });
}

module.exports = errorHandler;
