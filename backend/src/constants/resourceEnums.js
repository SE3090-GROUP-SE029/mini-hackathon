const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'ICT',
  'Physics',
  'Chemistry',
  'Biology',
  'Business Studies',
  'Accounting',
  'History',
  'Geography',
  'Combined Mathematics',
];

const EDUCATION_LEVELS = [
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'G.C.E. O/L',
  'Grade 12',
  'Grade 13',
  'G.C.E. A/L',
  'University',
  'Other',
];

const RESOURCE_TYPES = [
  'Past Paper',
  'Model Paper',
  'Lecture Note',
  'Study Note',
  'Question Paper',
  'Revision Paper',
  'Tutorial',
  'Other',
];

const LANGUAGES = ['Sinhala', 'Tamil', 'English'];

const TITLE_MIN = 3;
const TITLE_MAX = 160;
const DESCRIPTION_MIN = 20;
const DESCRIPTION_MAX = 2000;
const PROVIDER_MAX = 160;
const UPLOADER_MAX = 120;
const TAG_MAX = 40;
const TAG_LIMIT = 8;
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.ppt', '.pptx'];
const BLOCKED_EXTENSIONS = [
  '.exe',
  '.sh',
  '.bat',
  '.cmd',
  '.com',
  '.msi',
  '.dll',
  '.scr',
  '.js',
  '.vbs',
  '.ps1',
  '.jar',
  '.php',
  '.html',
  '.htm',
];

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/x-pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/octet-stream',
];

module.exports = {
  SUBJECTS,
  EDUCATION_LEVELS,
  RESOURCE_TYPES,
  LANGUAGES,
  TITLE_MIN,
  TITLE_MAX,
  DESCRIPTION_MIN,
  DESCRIPTION_MAX,
  PROVIDER_MAX,
  UPLOADER_MAX,
  TAG_MAX,
  TAG_LIMIT,
  MAX_FILE_SIZE,
  ALLOWED_EXTENSIONS,
  BLOCKED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
};
