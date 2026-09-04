const multer = require('multer');
const { MAX_FILE_SIZE, validateUploadedFile } = require('../utils/fileValidation');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter(_req, file, callback) {
    const message = validateUploadedFile(file, { required: true });
    if (!message) {
      callback(null, true);
      return;
    }
    const error = new Error(message);
    error.status = 400;
    error.errors = { file: message };
    callback(error);
  },
});

function optionalFileUpload(req, res, next) {
  upload.single('file')(req, res, (error) => {
    if (!error) {
      next();
      return;
    }
    next(error);
  });
}

module.exports = {
  optionalFileUpload,
};
