import { EDUCATION_LEVELS, RESOURCE_TYPES, SUBJECTS } from '../data/resourceConstants';
import { formatFileSize } from '../utils/resourceUtils';
import { ALLOWED_EXTENSIONS, validateSelectedFile } from '../utils/resourceValidation';

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p className="field-error" id={id} role="alert">
      {message}
    </p>
  );
}

function ResourceUpload({
  values,
  errors,
  file,
  existingFile,
  uploading,
  progress,
  formError,
  isUpdate = false,
  onChange,
  onFileChange,
  onRemoveFile,
  onSubmit,
}) {
  const update = (event) => {
    const { name, value } = event.target;
    onChange({ ...values, [name]: value });
  };

  const handleFile = (event) => {
    const selected = event.target.files?.[0] || null;
    const message = selected ? validateSelectedFile(selected, { required: false }) : '';
    onFileChange(selected, message);
    event.target.value = '';
  };

  const accept = ALLOWED_EXTENSIONS.join(',');
  const selectedName = file?.name || existingFile?.fileName || '';
  const selectedSize = file ? formatFileSize(file.size) : formatFileSize(existingFile?.fileSize);

  return (
    <form className="recommend-form resource-form" onSubmit={onSubmit} noValidate>
      {formError ? (
        <p className="form-banner form-banner-error" role="alert">
          {formError}
        </p>
      ) : null}

      <label className="field" htmlFor="title">
        <span>Resource title</span>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={update}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'title-error' : undefined}
          required
        />
        <FieldError id="title-error" message={errors.title} />
      </label>

      <label className="field" htmlFor="description">
        <span>Description</span>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={values.description}
          onChange={update}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'description-error' : undefined}
          required
        />
        <FieldError id="description-error" message={errors.description} />
      </label>

      <div className="form-grid">
        <label className="field" htmlFor="subject">
          <span>Subject</span>
          <select
            id="subject"
            name="subject"
            value={values.subject}
            onChange={update}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'resource-subject-error' : undefined}
            required
          >
            <option value="">Select a subject</option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <FieldError id="resource-subject-error" message={errors.subject} />
        </label>

        <label className="field" htmlFor="educationLevel">
          <span>Education level</span>
          <select
            id="educationLevel"
            name="educationLevel"
            value={values.educationLevel}
            onChange={update}
            aria-invalid={Boolean(errors.educationLevel)}
            aria-describedby={errors.educationLevel ? 'resource-level-error' : undefined}
            required
          >
            <option value="">Select a level</option>
            {EDUCATION_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <FieldError id="resource-level-error" message={errors.educationLevel} />
        </label>

        <label className="field" htmlFor="type">
          <span>Resource type</span>
          <select
            id="type"
            name="type"
            value={values.type}
            onChange={update}
            aria-invalid={Boolean(errors.type)}
            aria-describedby={errors.type ? 'resource-type-error' : undefined}
            required
          >
            <option value="">Select a type</option>
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <FieldError id="resource-type-error" message={errors.type} />
        </label>

        <label className="field" htmlFor="author">
          <span>Author / creator</span>
          <input
            id="author"
            name="author"
            value={values.author}
            onChange={update}
            aria-invalid={Boolean(errors.author)}
            aria-describedby={errors.author ? 'author-error' : undefined}
            required
          />
          <FieldError id="author-error" message={errors.author} />
        </label>
      </div>

      <label className="field" htmlFor="tags">
        <span>Tags</span>
        <input
          id="tags"
          name="tags"
          value={values.tags}
          onChange={update}
          placeholder="exam-prep, algebra, grade-11"
        />
        <small>Separate tags with commas. Optional.</small>
      </label>

      <div className={errors.file ? 'upload-box has-error' : 'upload-box'}>
        <label className="field" htmlFor="file">
          <span>File upload</span>
          <input
            id="file"
            name="file"
            type="file"
            accept={accept}
            onChange={handleFile}
            aria-invalid={Boolean(errors.file)}
            aria-describedby={errors.file ? 'file-error' : 'file-help'}
          />
          <small id="file-help">PDF, DOC, DOCX, PPT, PPTX or images up to 10MB.</small>
          <FieldError id="file-error" message={errors.file} />
        </label>

        {selectedName ? (
          <div className="file-preview">
            <div>
              <strong>{selectedName}</strong>
              {selectedSize ? <p>{selectedSize}{file ? ' · ready to upload' : ' · currently saved'}</p> : null}
            </div>
            <div className="file-preview-actions">
              <label className="btn btn-secondary" htmlFor="file">
                Replace file
              </label>
              <button type="button" className="btn btn-ghost" onClick={onRemoveFile}>
                Remove file
              </button>
            </div>
          </div>
        ) : (
          <p className="upload-empty">No file selected yet.</p>
        )}

        {uploading ? (
          <div className="upload-progress" role="status" aria-live="polite">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p>Uploading… {progress}%</p>
          </div>
        ) : null}
      </div>

      <button className="btn btn-primary" type="submit" disabled={uploading}>
        {uploading ? 'Saving resource…' : isUpdate ? 'Save changes' : 'Save resource'}
      </button>
    </form>
  );
}

export default ResourceUpload;
