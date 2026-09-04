/**
 * Shared resource contract used by:
 * - Developer 1: search, filter, upload, details
 * - Developer 2: saved resources
 * - Developer 3: local recommendation matching
 *
 * Live catalogue data is loaded from GET /api/resources.
 *
 * {
 *   id, title, description, subject,
 *   educationLevel, level,
 *   resourceType, type,
 *   language, providerName, provider,
 *   uploadedBy, tags, fileName, fileType, fileSize,
 *   createdAt, url
 * }
 */

export {
  EDUCATION_LEVELS,
  LANGUAGES,
  RESOURCE_TYPES,
  SORT_OPTIONS,
  SUBJECTS,
} from './resourceConstants.js'

const resources = []

export default resources
