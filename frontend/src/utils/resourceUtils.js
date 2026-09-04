export function matchesSearch(resource, searchTerm) {
  const needle = searchTerm.trim().toLowerCase();
  if (!needle) return true;

  return [resource.title, resource.description, resource.subject]
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(needle));
}

export function filterResources(resources, filters = {}) {
  const { search = '', subject = '', educationLevel = '', language = '', type = '' } = filters;

  return resources.filter((resource) => {
    if (!matchesSearch(resource, search)) return false;
    if (subject && resource.subject !== subject) return false;
    if (educationLevel && resource.educationLevel !== educationLevel) return false;
    if (language && resource.language !== language) return false;
    if (type && resource.type !== type) return false;
    return true;
  });
}

export function sortResources(resources, sort = 'newest') {
  const copy = [...resources];
  if (sort === 'az') {
    return copy.sort((a, b) => a.title.localeCompare(b.title));
  }
  return copy.sort((a, b) => {
    const dateDiff = new Date(b.uploadDate) - new Date(a.uploadDate);
    return dateDiff || a.title.localeCompare(b.title);
  });
}

export function processResources(resources, filters = {}) {
  const filtered = filterResources(resources, filters);
  const sorted = sortResources(filtered, filters.sort);
  return {
    resources: sorted,
    resultCount: sorted.length,
  };
}

export function formatDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getResourceById(resources, id) {
  return resources.find((resource) => resource.id === id) || null;
}

export function formatFileSize(bytes) {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size < 0) return '';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function hasUploadedFile(resource) {
  return Boolean(resource?.fileName || resource?.fileId || resource?.fileUrl);
}
