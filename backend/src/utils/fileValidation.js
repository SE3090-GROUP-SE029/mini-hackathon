const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
};

const ALLOWED_EXTENSIONS = Object.values(ALLOWED_MIME_TYPES).flat();

function getExtension(filename = '') {
  const match = String(filename).toLowerCase().match(/\.[a-z0-9]+$/);
  return match ? match[0] : '';
}

function validateUploadedFile(file, { required = true } = {}) {
  if (!file) {
    return required ? 'Please attach a PDF, Word, PowerPoint or image file.' : null;
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'That file is too large. Please keep uploads to 10MB or less.';
  }

  const extension = getExtension(file.originalname || file.name);
  const mime = file.mimetype || file.type;
  const mimeAllowed = Boolean(ALLOWED_MIME_TYPES[mime]);
  const extensionAllowed = ALLOWED_EXTENSIONS.includes(extension);

  if (!mimeAllowed && !extensionAllowed) {
    return 'That file type is not supported. Use PDF, DOC, DOCX, PPT, PPTX or an image.';
  }

  if (mimeAllowed && ALLOWED_MIME_TYPES[mime].length && extension && !ALLOWED_MIME_TYPES[mime].includes(extension)) {
    return 'The file extension does not match the selected file type.';
  }

  return null;
}

module.exports = {
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  getExtension,
  validateUploadedFile,
};
