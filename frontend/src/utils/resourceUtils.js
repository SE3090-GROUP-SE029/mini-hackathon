import { EDUCATION_LEVELS, LANGUAGES, RESOURCE_TYPES, SUBJECTS } from '../data/resourceConstants.js'

const LEVEL_RANK = EDUCATION_LEVELS.reduce((ranks, level, index) => {
  ranks[level] = index
  return ranks
}, {})

function normalise(value) {
  return String(value ?? '').trim().toLowerCase()
}

function getLevel(resource) {
  return resource.educationLevel || resource.level || ''
}

function getType(resource) {
  return resource.resourceType || resource.type || ''
}

function getProvider(resource) {
  return resource.providerName || resource.provider || ''
}

/**
 * Search by title, description, and subject.
 */
export function searchResources(resources, query) {
  const needle = normalise(query)
  if (!needle) return resources

  return resources.filter((resource) => {
    const haystack = [resource.title, resource.description, resource.subject]
      .map(normalise)
      .join(' ')
    return haystack.includes(needle)
  })
}

export function filterBySubject(resources, subject) {
  if (!subject || subject === 'all') return resources
  return resources.filter((resource) => resource.subject === subject)
}

export function filterByEducationLevel(resources, level) {
  if (!level || level === 'all') return resources
  return resources.filter((resource) => getLevel(resource) === level)
}

export function filterByLevel(resources, level) {
  return filterByEducationLevel(resources, level)
}

export function filterByLanguage(resources, language) {
  if (!language || language === 'all') return resources
  return resources.filter((resource) => resource.language === language)
}

export function filterByType(resources, type) {
  if (!type || type === 'all') return resources
  return resources.filter((resource) => getType(resource) === type)
}

export function filterResources(resources, { subject = 'all', level = 'all', language = 'all', type = 'all' } = {}) {
  let result = filterBySubject(resources, subject)
  result = filterByEducationLevel(result, level)
  result = filterByLanguage(result, language)
  result = filterByType(result, type)
  return result
}

export function sortResources(resources, sortBy = 'newest') {
  const sorted = [...resources]
  const byTitle = (a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' })
  const byDate = (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)

  switch (sortBy) {
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0) || byTitle(a, b))
    case 'title-asc':
      return sorted.sort(byTitle)
    case 'title-desc':
      return sorted.sort((a, b) => byTitle(b, a))
    case 'newest':
    default:
      return sorted.sort((a, b) => byDate(a, b) || byTitle(a, b))
  }
}

export function getResourceCount(resources) {
  return resources.length
}

export function getResourceCountLabel(count) {
  if (count === 0) return 'No resources found'
  if (count === 1) return '1 resource found'
  return `${count} resources found`
}

export function getFilterOptions() {
  return {
    subjects: SUBJECTS,
    levels: EDUCATION_LEVELS,
    languages: LANGUAGES,
    types: RESOURCE_TYPES,
  }
}

export function getResourceById(resources, id) {
  return resources.find((resource) => resource.id === id || resource._id === id) ?? null
}

export function processResources(
  resources,
  {
    query = '',
    subject = 'all',
    level = 'all',
    language = 'all',
    type = 'all',
    sortBy = 'newest',
  } = {},
) {
  let result = searchResources(resources, query)
  result = filterResources(result, { subject, level, language, type })
  return sortResources(result, sortBy)
}

export function hasActiveFilters({ query, subject, level, language, type }) {
  return Boolean(
    normalise(query) ||
      (subject && subject !== 'all') ||
      (level && level !== 'all') ||
      (language && language !== 'all') ||
      (type && type !== 'all'),
  )
}

export function formatUploadDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown date'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatFileSize(bytes) {
  const size = Number(bytes)
  if (!Number.isFinite(size) || size < 0) return 'Unknown size'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round((size / 1024) * 10) / 10} KB`
  return `${Math.round((size / (1024 * 1024)) * 10) / 10} MB`
}

export function getResourceMeta(resource) {
  return {
    ...resource,
    educationLevel: getLevel(resource),
    resourceType: getType(resource),
    providerName: getProvider(resource),
  }
}

export { LEVEL_RANK }
