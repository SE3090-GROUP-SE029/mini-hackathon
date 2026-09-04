const multer = require('multer');
const { MAX_FILE_SIZE } = require('../constants/resourceEnums');
const { isAllowedExtension, isBlockedExtension, isAllowedMimeType } = require('../utils/fileValidation');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter(req, file, cb) {
    if (
      isBlockedExtension(file.originalname) ||
      !isAllowedExtension(file.originalname) ||
      !isAllowedMimeType(file.mimetype)
    ) {
      const error = new Error('INVALID_FILE_TYPE');
      error.status = 400;
      return cb(error);
    }

    cb(null, true);
  },
});

function handleMulterError(error, req, res, next) {
  if (!error) return next();

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size must be less than 20 MB.',
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Please upload a PDF or supported document.',
    });
  }

  if (error.message === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      success: false,
      message: 'Please upload a PDF or supported document.',
    });
  }

  return next(error);
}

module.exports = {
  resourceUpload: upload.single('file'),
  handleMulterError,
};
