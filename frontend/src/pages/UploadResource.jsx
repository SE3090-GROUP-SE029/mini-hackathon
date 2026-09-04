import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createResource, fetchResourceById, updateResource } from '../api/resourcesApi';
import LoadingState from '../components/LoadingState';
import ResourceUpload from '../components/ResourceUpload';
import { EMPTY_RESOURCE_FORM, validateResourceForm } from '../utils/resourceValidation';

function UploadResource() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isUpdate = Boolean(id);
  const [values, setValues] = useState(EMPTY_RESOURCE_FORM);
  const [file, setFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(!isUpdate);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!isUpdate) return undefined;
    let active = true;

    fetchResourceById(id).then((result) => {
      if (!active) return;
      const resource = result.resource;
      if (!resource) {
        setMissing(true);
        setLoaded(true);
        return;
      }
      setValues({
        title: resource.title || '',
        description: resource.description || '',
        subject: resource.subject || '',
        educationLevel: resource.educationLevel || '',
        type: resource.type || '',
        author: resource.author || resource.provider || '',
        tags: (resource.tags || []).join(', '),
      });
      if (resource.fileName) {
        setExistingFile({
          fileName: resource.fileName,
          fileSize: resource.fileSize,
        });
      }
      setLoaded(true);
    });

    return () => {
      active = false;
    };
  }, [id, isUpdate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = validateResourceForm(values, file, {
      isUpdate,
      existingFile: Boolean(existingFile),
    });
    setErrors(result.errors);
    setFormError('');
    if (!result.isValid) return;

    setUploading(true);
    setProgress(file ? 1 : 100);

    try {
      if (isUpdate) {
        await updateResource(
          id,
          result.values,
          file,
          setProgress,
          { removeFile: existingFile ? 'false' : 'true' }
        );
        navigate('/resources', { state: { notice: 'Resource updated.' } });
      } else {
        await createResource(result.values, file, setProgress);
        navigate('/resources', { state: { notice: 'Resource added to the catalogue.' } });
      }
    } catch (error) {
      setErrors(error.errors || {});
      setFormError(error.message || 'The resource could not be saved.');
    } finally {
      setUploading(false);
    }
  };

  if (!loaded) {
    return (
      <section className="page">
        <div className="container">
          <LoadingState label="Opening the resource form…" />
        </div>
      </section>
    );
  }

  if (missing) {
    return (
      <section className="page">
        <div className="container">
          <h1>Resource not found</h1>
          <p>This item cannot be edited because it is no longer in the catalogue.</p>
          <Link className="btn btn-primary" to="/resources">
            Back to resources
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container recommend-layout">
        <header className="page-header">
          <p className="eyebrow">{isUpdate ? 'Edit resource' : 'Add resource'}</p>
          <h1>{isUpdate ? 'Update this educational resource' : 'Add an educational resource'}</h1>
          <p>
            Title, description, subject, level, type and author are required. Attach a PDF, Word,
            PowerPoint or image file up to 10MB.
          </p>
        </header>

        <ResourceUpload
          values={values}
          errors={errors}
          file={file}
          existingFile={existingFile}
          uploading={uploading}
          progress={progress}
          formError={formError}
          isUpdate={isUpdate}
          onChange={(next) => {
            setValues(next);
            setFormError('');
          }}
          onFileChange={(selected, message) => {
            setFile(selected);
            if (selected) {
              setExistingFile({ fileName: selected.name, fileSize: selected.size });
            }
            setErrors((current) => ({ ...current, file: message }));
          }}
          onRemoveFile={() => {
            setFile(null);
            setExistingFile(null);
            setProgress(0);
            setErrors((current) => ({
              ...current,
              file: isUpdate ? '' : 'Please attach a PDF, Word, PowerPoint or image file.',
            }));
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}

export default UploadResource;
