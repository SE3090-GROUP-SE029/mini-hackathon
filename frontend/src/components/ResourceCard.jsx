import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatFileSize, formatUploadDate, getResourceMeta } from '../utils/resourceUtils.js'

function ResourceCard({ resource, actions }) {
  const item = getResourceMeta(resource)
  const [expanded, setExpanded] = useState(false)
  const resourceId = item.id || item._id

  return (
    <article className="resource-card">
      <header className="resource-card__top">
        <span className="resource-chip resource-chip--type">{item.resourceType}</span>
        <span className="resource-chip resource-chip--level">{item.educationLevel}</span>
      </header>

      <h3 className="resource-card__title">{item.title}</h3>
      <p className="resource-card__description">
        {expanded ? item.description : truncate(item.description, 150)}
      </p>

      <dl className="resource-card__meta">
        <div>
          <dt>Subject</dt>
          <dd>{item.subject}</dd>
        </div>
        <div>
          <dt>Language</dt>
          <dd>{item.language}</dd>
        </div>
        <div>
          <dt>Provider</dt>
          <dd>{item.providerName || 'Not specified'}</dd>
        </div>
        <div>
          <dt>Uploaded</dt>
          <dd>{formatUploadDate(item.createdAt)}</dd>
        </div>
        <div>
          <dt>File</dt>
          <dd>
            {item.fileType || 'PDF'} · {formatFileSize(item.fileSize)}
          </dd>
        </div>
      </dl>

      {item.tags?.length ? (
        <p className="resource-card__tags">
          {item.tags.map((tag) => (
            <span key={tag} className="resource-chip resource-chip--tag">
              {tag}
            </span>
          ))}
        </p>
      ) : null}

      <div className="resource-card__actions">
        <Link className="resource-card__link" to={`/resources/${resourceId}`}>
          View Resource
        </Link>
        {actions}
        <button
          type="button"
          className="resource-card__toggle"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      </div>
    </article>
  )
}

function truncate(text, maxLength) {
  const value = String(text || '')
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength).trim()}…`
}

export default ResourceCard
