import {
  ALLOWED_EXTENSIONS,
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  EDUCATION_LEVELS,
  LANGUAGES,
  MAX_FILE_SIZE,
  RESOURCE_TYPES,
  SUBJECTS,
  TITLE_MAX,
  TITLE_MIN,
} from '../data/resourceConstants.js'

function getExtension(fileName) {
  const name = String(fileName || '').toLowerCase()
  const index = name.lastIndexOf('.')
  return index >= 0 ? name.slice(index) : ''
}

export function validateResourceForm({
  title,
  description,
  subject,
  educationLevel,
  resourceType,
  language,
  file,
}) {
  const errors = {}
  const trimmedTitle = String(title ?? '').trim()
  const trimmedDescription = String(description ?? '').trim()

  if (!trimmedTitle) {
    errors.title = 'Please enter a resource title.'
  } else if (trimmedTitle.length < TITLE_MIN) {
    errors.title = `Please enter a title of at least ${TITLE_MIN} characters.`
  } else if (trimmedTitle.length > TITLE_MAX) {
    errors.title = `Please keep the title under ${TITLE_MAX} characters.`
  }

  if (!trimmedDescription) {
    errors.description = 'Please enter a short description of this resource.'
  } else if (trimmedDescription.length < DESCRIPTION_MIN) {
    errors.description = 'Please add a slightly longer description so students know what this covers.'
  } else if (trimmedDescription.length > DESCRIPTION_MAX) {
    errors.description = `Please keep the description under ${DESCRIPTION_MAX} characters.`
  }

  if (!subject || !SUBJECTS.includes(subject)) {
    errors.subject = 'Please select a subject.'
  }

  if (!educationLevel || !EDUCATION_LEVELS.includes(educationLevel)) {
    errors.educationLevel = 'Please select an education level.'
  }

  if (!resourceType || !RESOURCE_TYPES.includes(resourceType)) {
    errors.resourceType = 'Please select a resource type.'
  }

  if (!language || !LANGUAGES.includes(language)) {
    errors.language = 'Please select a language.'
  }

  if (!file) {
    errors.file = 'Please upload a PDF or supported document.'
  } else {
    const extension = getExtension(file.name)
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      errors.file = 'Please upload a PDF or supported document.'
    } else if (file.size > MAX_FILE_SIZE) {
      errors.file = 'File size must be less than 20 MB.'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
