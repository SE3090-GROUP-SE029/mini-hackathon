import { Link } from 'react-router-dom';
import { getResourceFileUrl } from '../api/resourcesApi';
import { formatDate, formatFileSize, hasUploadedFile } from '../utils/resourceUtils';
import SaveButton from './SaveButton';

function ResourceCard({
  resource,
  showScore = false,
  saveVariant = 'default',
  showManageActions = false,
  onDelete,
}) {
  const fileReady = hasUploadedFile(resource);

  return (
    <article className="resource-card">
      <div className="card-meta">
        <span className="chip">{resource.subject}</span>
        <span className="chip chip-muted">{resource.educationLevel}</span>
        <span className="chip chip-muted">{resource.type}</span>
        {showScore && typeof resource.matchScore === 'number' ? (
          <span className="chip chip-score">Score {resource.matchScore}</span>
        ) : null}
      </div>
      <h3>
        <Link to={`/resources/${resource.id}`}>{resource.title}</Link>
      </h3>
      <p className="card-copy">{resource.description}</p>
      <dl className="card-facts">
        <div>
          <dt>Type</dt>
          <dd>{resource.type}</dd>
        </div>
        <div>
          <dt>Author</dt>
          <dd>{resource.author || resource.provider}</dd>
        </div>
        <div>
          <dt>Added</dt>
          <dd>{formatDate(resource.uploadDate)}</dd>
        </div>
        <div>
          <dt>File</dt>
          <dd>
            {fileReady
              ? `${resource.fileName || 'Attached file'}${resource.fileSize ? ` · ${formatFileSize(resource.fileSize)}` : ''}`
              : 'External link'}
          </dd>
        </div>
      </dl>
      <div className="tag-row">
        {(resource.tags || []).slice(0, 4).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="card-actions">
        <Link className="btn btn-secondary" to={`/resources/${resource.id}`}>
          View
        </Link>
        {fileReady ? (
          <a className="btn btn-secondary" href={getResourceFileUrl(resource)}>
            Download
          </a>
        ) : null}
        {showManageActions ? (
          <>
            <Link className="btn btn-secondary" to={`/resources/${resource.id}/edit`}>
              Edit
            </Link>
            <button type="button" className="btn btn-ghost" onClick={() => onDelete?.(resource)}>
              Delete
            </button>
          </>
        ) : null}
        <SaveButton resource={resource} variant={saveVariant} />
      </div>
    </article>
  );
}

export default ResourceCard;
