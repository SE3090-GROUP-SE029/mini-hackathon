const { TAG_MAX, TAG_LIMIT } = require('../constants/resourceEnums');

function stripHtml(value) {
  return String(value ?? '').replace(/<[^>]*>/g, '');
}

function sanitiseText(value, maxLength = 500) {
  const cleaned = stripHtml(value)
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.slice(0, maxLength);
}

function sanitiseTags(input) {
  let tags = input;

  if (typeof input === 'string') {
    tags = input.split(/[,;]/);
  }

  if (!Array.isArray(tags)) return [];

  const unique = [];

  for (const tag of tags) {
    const cleaned = sanitiseText(tag, TAG_MAX);
    if (!cleaned) continue;

    const exists = unique.some((item) => item.toLowerCase() === cleaned.toLowerCase());
    if (!exists) unique.push(cleaned);
    if (unique.length >= TAG_LIMIT) break;
  }

  return unique;
}

function sanitiseFileName(originalName) {
  const name = String(originalName || 'resource')
    .replace(/\\/g, '/')
    .split('/')
    .pop();

  return sanitiseText(name, 180) || 'resource';
}

module.exports = {
  stripHtml,
  sanitiseText,
  sanitiseTags,
  sanitiseFileName,
};
