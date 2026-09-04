const {
  SUBJECTS,
  EDUCATION_LEVELS,
  RESOURCE_TYPES,
  LANGUAGES,
} = require('../constants/resourceEnums');
const { asTrimmedString } = require('../utils/sanitize');
const { validateUploadedFile } = require('../utils/fileValidation');

function parseTags(value) {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }
  return asTrimmedString(value)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function validateResource(req, res, next) {
  const isUpdate = req.method === 'PUT' || req.method === 'PATCH';
  const title = asTrimmedString(req.body.title);
  const description = asTrimmedString(req.body.description);
  const subject = asTrimmedString(req.body.subject);
  const educationLevel = asTrimmedString(req.body.educationLevel);
  const type = asTrimmedString(req.body.type);
  const author = asTrimmedString(req.body.author || req.body.provider);
  const language = asTrimmedString(req.body.language) || 'English';
  const tags = parseTags(req.body.tags);
  const errors = {};

  if (!title) {
    errors.title = 'Please enter a resource title.';
  } else if (title.length < 3) {
    errors.title = 'The title needs at least 3 characters.';
  }

  if (!description) {
    errors.description = 'Please add a short description.';
  } else if (description.length < 10) {
    errors.description = 'Please write at least 10 characters so students know what this contains.';
  }

  if (!subject) {
    errors.subject = 'Please choose a subject.';
  } else if (!SUBJECTS.includes(subject)) {
    errors.subject = 'Choose a subject from the list.';
  }

  if (!educationLevel) {
    errors.educationLevel = 'Please choose an education level.';
  } else if (!EDUCATION_LEVELS.includes(educationLevel)) {
    errors.educationLevel = 'Choose O/L, A/L or University.';
  }

  if (!type) {
    errors.type = 'Please choose a resource type.';
  } else if (!RESOURCE_TYPES.includes(type)) {
    errors.type = 'Choose Notes, Past Papers, Tutorials or Video Courses.';
  }

  if (!author) {
    errors.author = 'Please enter the author or creator.';
  }

  if (language && !LANGUAGES.includes(language)) {
    errors.language = 'Choose English, Sinhala or Tamil.';
  }

  const fileError = validateUploadedFile(req.file, { required: !isUpdate });
  if (fileError) {
    errors.file = fileError;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Please fix the highlighted fields before saving.',
      errors,
    });
  }

  req.resourceInput = {
    title,
    description,
    subject,
    educationLevel,
    type,
    author,
    provider: author,
    language,
    tags,
    removeFile: String(req.body.removeFile || '') === 'true',
  };

  return next();
}

module.exports = validateResource;
