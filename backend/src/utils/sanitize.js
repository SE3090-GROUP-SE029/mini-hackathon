function escapeRegex(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function asTrimmedString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseHours(value) {
  const hours = Number(value);
  return Number.isFinite(hours) ? hours : NaN;
}

function slugify(title = '') {
  const base = String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return `${base || 'resource'}-${Date.now().toString(36)}`;
}

module.exports = {
  escapeRegex,
  asTrimmedString,
  parseHours,
  slugify,
};
