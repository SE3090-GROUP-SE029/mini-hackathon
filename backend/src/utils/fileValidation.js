const path = require('path');
const {
  MAX_FILE_SIZE,
  ALLOWED_EXTENSIONS,
  BLOCKED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
} = require('../constants/resourceEnums');

function getExtension(filename) {
  const ext = path.extname(String(filename || '')).toLowerCase();
  return ext;
}

function isBlockedExtension(filename) {
  return BLOCKED_EXTENSIONS.includes(getExtension(filename));
}

function isAllowedExtension(filename) {
  const ext = getExtension(filename);
  return ALLOWED_EXTENSIONS.includes(ext) && !isBlockedExtension(filename);
}

function isAllowedMimeType(mimeType) {
  return ALLOWED_MIME_TYPES.includes(String(mimeType || '').toLowerCase());
}

function looksLikePdf(buffer) {
  if (!buffer || buffer.length < 5) return false;
  return buffer.slice(0, 5).toString('ascii') === '%PDF-';
}

function looksLikeOle(buffer) {
  return Boolean(
    buffer &&
      buffer.length >= 4 &&
      buffer[0] === 0xd0 &&
      buffer[1] === 0xcf &&
      buffer[2] === 0x11 &&
      buffer[3] === 0xe0,
  );
}

function looksLikeZip(buffer) {
  return Boolean(buffer && buffer.length >= 2 && buffer[0] === 0x50 && buffer[1] === 0x4b);
}

function matchesFileSignature(filename, buffer) {
  const ext = getExtension(filename);

  if (ext === '.pdf') return looksLikePdf(buffer);
  if (ext === '.doc' || ext === '.ppt') return looksLikeOle(buffer);
  if (ext === '.docx' || ext === '.pptx') return looksLikeZip(buffer);
  return false;
}

function getFileValidationMessage(file) {
  if (!file) {
    return 'Please upload a PDF or supported document.';
  }

  if (isBlockedExtension(file.originalname)) {
    return 'Please upload a PDF or supported document.';
  }

  if (!isAllowedExtension(file.originalname)) {
    return 'Please upload a PDF or supported document.';
  }

  if (!isAllowedMimeType(file.mimetype)) {
    return 'Please upload a PDF or supported document.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be less than 20 MB.';
  }

  if (file.buffer && !matchesFileSignature(file.originalname, file.buffer)) {
    return 'Please upload a PDF or supported document.';
  }

  return null;
}

function isValidUploadFile(file) {
  return !getFileValidationMessage(file);
}

module.exports = {
  getExtension,
  isBlockedExtension,
  isAllowedExtension,
  isAllowedMimeType,
  matchesFileSignature,
  getFileValidationMessage,
  isValidUploadFile,
  MAX_FILE_SIZE,
};
