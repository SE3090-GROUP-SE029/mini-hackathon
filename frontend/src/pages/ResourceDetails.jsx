import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteResource, fetchResourceById, getResourceFileUrl } from '../api/resourcesApi';
import EmptyResourceState from '../components/EmptyResourceState';
import LoadingState from '../components/LoadingState';
import SaveButton from '../components/SaveButton';
import { formatDate, formatFileSize, hasUploadedFile } from '../utils/resourceUtils';

function ResourceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    let active = true;

    fetchResourceById(id).then((result) => {
      if (!active) return;
      setResource(result.resource);
      setLoadedId(id);
    });

    return () => {
      active = false;
    };
  }, [id]);

  const loading = loadedId !== id;
  const fileReady = hasUploadedFile(resource);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete “${resource.title}”? The attached file will be removed as well.`
    );
    if (!confirmed) return;

    try {
      await deleteResource(resource.id);
      navigate('/resources', { state: { notice: 'Resource deleted.' } });
    } catch (error) {
      setActionError(error.message || 'The resource could not be deleted.');
    }
  };

  if (loading) {
    return (
      <section className="page">
        <div className="container">
          <LoadingState label="Opening resource…" />
        </div>
      </section>
    );
  }

  if (!resource) {
    return (
      <section className="page">
        <div className="container">
          <EmptyResourceState
            title="Resource not found"
            message="It may have been removed, or the link is incomplete. Browse the catalogue to continue."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container detail-layout">
        <Link className="text-button" to="/resources">
          ← Back to resources
        </Link>
        <div className="detail-card">
          <div className="card-meta">
            <span className="chip">{resource.subject}</span>
            <span className="chip chip-muted">{resource.educationLevel}</span>
            <span className="chip chip-muted">{resource.type}</span>
          </div>
          <h1>{resource.title}</h1>
          <p className="lede">{resource.description}</p>

          {actionError ? (
            <p className="form-banner form-banner-error" role="alert">
              {actionError}
            </p>
          ) : null}

          <dl className="detail-facts">
            <div>
              <dt>Author / creator</dt>
              <dd>{resource.author || resource.provider}</dd>
            </div>
            <div>
              <dt>Resource type</dt>
              <dd>{resource.type}</dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>{resource.language}</dd>
            </div>
            <div>
              <dt>Added on</dt>
              <dd>{formatDate(resource.uploadDate)}</dd>
            </div>
            <div>
              <dt>File</dt>
              <dd>
                {fileReady
                  ? `${resource.fileName}${resource.fileSize ? ` · ${formatFileSize(resource.fileSize)}` : ''}`
                  : 'No file attached'}
              </dd>
            </div>
          </dl>

          <div className="tag-row">
            {(resource.tags || []).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="card-actions">
            {fileReady ? (
              <a className="btn btn-primary" href={getResourceFileUrl(resource)}>
                Download
              </a>
            ) : null}
            {resource.externalLink && !fileReady ? (
              <a
                className="btn btn-primary"
                href={resource.externalLink}
                target="_blank"
                rel="noreferrer"
              >
                Visit resource
              </a>
            ) : null}
            <Link className="btn btn-secondary" to={`/resources/${resource.id}/edit`}>
              Edit
            </Link>
            <button type="button" className="btn btn-ghost" onClick={handleDelete}>
              Delete
            </button>
            <SaveButton resource={resource} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResourceDetails;
