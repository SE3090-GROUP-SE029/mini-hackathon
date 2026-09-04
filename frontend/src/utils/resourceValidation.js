import { EDUCATION_LEVELS, RESOURCE_TYPES, SUBJECTS } from '../data/resourceConstants';

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png', '.gif', '.webp'];

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const EMPTY_RESOURCE_FORM = {
  title: '',
  description: '',
  subject: '',
  educationLevel: '',
  type: '',
  author: '',
  tags: '',
};

export function getFileExtension(filename = '') {
  const match = String(filename).toLowerCase().match(/\.[a-z0-9]+$/);
  return match ? match[0] : '';
}

export function validateSelectedFile(file, { required = true, existingFile = false } = {}) {
  if (!file) {
    if (required && !existingFile) {
      return 'Please attach a PDF, Word, PowerPoint or image file.';
    }
    return '';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'That file is too large. Please keep uploads to 10MB or less.';
  }

  const extension = getFileExtension(file.name);
  const typeOk = ALLOWED_MIME_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(extension);
  if (!typeOk) {
    return 'That file type is not supported. Use PDF, DOC, DOCX, PPT, PPTX or an image.';
  }

  return '';
}

export function validateResourceForm(values, file, { isUpdate = false, existingFile = false } = {}) {
  const errors = {};
  const title = values.title?.trim();
  const description = values.description?.trim();
  const subject = values.subject?.trim();
  const educationLevel = values.educationLevel?.trim();
  const type = values.type?.trim();
  const author = values.author?.trim();
  const tags = values.tags?.trim() || '';

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

  const fileError = validateSelectedFile(file, {
    required: !isUpdate,
    existingFile: isUpdate && existingFile,
  });
  if (fileError) {
    errors.file = fileError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values: {
      title,
      description,
      subject,
      educationLevel,
      type,
      author,
      tags,
    },
  };
}
