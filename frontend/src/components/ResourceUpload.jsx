import { useState } from 'react'
import {
  EDUCATION_LEVELS,
  LANGUAGES,
  RESOURCE_TYPES,
  SUBJECTS,
} from '../data/resourceConstants.js'
import { uploadResource } from '../api/resourcesApi.js'
import { validateResourceForm } from '../utils/resourceValidation.js'

const INITIAL_FORM = {
  title: '',
  description: '',
  subject: '',
  educationLevel: '',
  resourceType: '',
  language: '',
  providerName: '',
  tags: '',
  file: null,
}

function ResourceUpload({ onUploaded }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [progress, setProgress] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [serverError, setServerError] = useState('')

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    setSuccessMessage('')
    setServerError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSuccessMessage('')
    setServerError('')

    const result = validateResourceForm(form)
    setErrors(result.errors)
    if (!result.isValid) return

    const formData = new FormData()
    formData.append('title', form.title.trim())
    formData.append('description', form.description.trim())
    formData.append('subject', form.subject)
    formData.append('educationLevel', form.educationLevel)
    formData.append('resourceType', form.resourceType)
    formData.append('language', form.language)
    formData.append('providerName', form.providerName.trim())
    formData.append('tags', form.tags.trim())
    formData.append('file', form.file)

    setSubmitting(true)
    setProgress(0)

    try {
      const created = await uploadResource(formData, { onProgress: setProgress })
      setForm(INITIAL_FORM)
      setErrors({})
      setProgress(100)
      setSuccessMessage('Resource uploaded successfully. Students can now find it in the catalogue.')
      onUploaded?.(created)
    } catch (error) {
      setServerError(error.message || 'The upload failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedFileName = form.file ? form.file.name : 'No file selected'

  return (
    <form className="resource-upload" onSubmit={handleSubmit} noValidate>
      <Field
        id="resource-title"
        label="Title"
        required
        error={errors.title}
      >
        <input
          id="resource-title"
          name="title"
          value={form.title}
          onChange={(event) => updateField('title', event.target.value)}
          placeholder="Physics Grade 12 Mechanics Past Paper"
          maxLength={160}
        />
      </Field>

      <Field
        id="resource-description"
        label="Description"
        required
        error={errors.description}
      >
        <textarea
          id="resource-description"
          name="description"
          value={form.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Past paper covering mechanics and motion"
          rows={5}
          maxLength={2000}
        />
      </Field>

      <div className="resource-upload__grid">
        <Field id="resource-subject" label="Subject" required error={errors.subject}>
          <select
            id="resource-subject"
            name="subject"
            value={form.subject}
            onChange={(event) => updateField('subject', event.target.value)}
          >
            <option value="">Select a subject</option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="resource-level"
          label="Education Level"
          required
          error={errors.educationLevel}
        >
          <select
            id="resource-level"
            name="educationLevel"
            value={form.educationLevel}
            onChange={(event) => updateField('educationLevel', event.target.value)}
          >
            <option value="">Select an education level</option>
            {EDUCATION_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="resource-type"
          label="Resource Type"
          required
          error={errors.resourceType}
        >
          <select
            id="resource-type"
            name="resourceType"
            value={form.resourceType}
            onChange={(event) => updateField('resourceType', event.target.value)}
          >
            <option value="">Select a resource type</option>
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field id="resource-language" label="Language" required error={errors.language}>
          <select
            id="resource-language"
            name="language"
            value={form.language}
            onChange={(event) => updateField('language', event.target.value)}
          >
            <option value="">Select a language</option>
            {LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="resource-provider" label="Provider / Institution">
        <input
          id="resource-provider"
          name="providerName"
          value={form.providerName}
          onChange={(event) => updateField('providerName', event.target.value)}
          placeholder="Optional"
          maxLength={160}
        />
      </Field>

      <Field
        id="resource-tags"
        label="Tags"
        hint="Separate tags with commas, for example Physics, Mechanics, A/L"
      >
        <input
          id="resource-tags"
          name="tags"
          value={form.tags}
          onChange={(event) => updateField('tags', event.target.value)}
          placeholder="Physics, Mechanics, A/L"
        />
      </Field>

      <Field id="resource-file" label="Upload File" required error={errors.file}>
        <input
          id="resource-file"
          name="file"
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf"
          onChange={(event) => updateField('file', event.target.files?.[0] || null)}
        />
        <p className="resource-upload__filename">{selectedFileName}</p>
        <p className="resource-upload__hint">PDF preferred. Also accepts DOC, DOCX, PPT, and PPTX up to 20 MB.</p>
      </Field>

      {submitting ? (
        <div className="resource-upload__progress" role="status" aria-live="polite">
          <progress max="100" value={progress}>
            {progress}%
          </progress>
          <span>Uploading… {progress}%</span>
        </div>
      ) : null}

      {successMessage ? (
        <p className="resource-upload__success" role="status">
          {successMessage}
        </p>
      ) : null}

      {serverError ? (
        <p className="resource-upload__error" role="alert">
          {serverError}
        </p>
      ) : null}

      <button type="submit" className="resource-upload__submit" disabled={submitting}>
        {submitting ? 'Uploading resource…' : 'Upload Resource'}
      </button>
    </form>
  )
}

function Field({ id, label, required, error, hint, children }) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className={`resource-upload__field${error ? ' is-invalid' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required ? <span className="required-mark"> required</span> : null}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="resource-upload__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="resource-upload__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default ResourceUpload
