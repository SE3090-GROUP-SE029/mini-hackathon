import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchResource, getResourceFileUrl } from '../api/resourcesApi.js'
import EmptyResourceState from '../components/EmptyResourceState.jsx'
import { formatFileSize, formatUploadDate, getResourceMeta } from '../utils/resourceUtils.js'

function ResourceDetails() {
  const { id } = useParams()
  const [resource, setResource] = useState(null)
  const [status, setStatus] = useState('loading')
  const [previewError, setPreviewError] = useState(false)

  async function loadResource() {
    setStatus('loading')
    setPreviewError(false)
    try {
      const data = await fetchResource(id)
      setResource(data)
      setStatus('ready')
    } catch {
      setResource(null)
      setStatus('error')
    }
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      setStatus('loading')
      setPreviewError(false)
      try {
        const data = await fetchResource(id)
        if (!cancelled) {
          setResource(data)
          setStatus('ready')
        }
      } catch {
        if (!cancelled) {
          setResource(null)
          setStatus('error')
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  if (status === 'loading') {
    return (
      <main className="resources-page">
        <EmptyResourceState variant="loading" />
      </main>
    )
  }

  if (status === 'error' || !resource) {
    return (
      <main className="resources-page">
        <EmptyResourceState variant="error" onRetry={loadResource} />
        <p className="resource-details__fallback">
          <Link to="/resources">Back to resources</Link>
        </p>
      </main>
    )
  }

  const item = getResourceMeta(resource)
  const viewUrl = getResourceFileUrl(item.id, { download: false })
  const downloadUrl = getResourceFileUrl(item.id, { download: true })
  const isPdf = String(item.fileType || '').toUpperCase() === 'PDF'

  return (
    <main className="resources-page resource-details">
      <p className="resources-page__eyebrow">{item.resourceType}</p>
      <h1>{item.title}</h1>
      <p className="resources-page__lead">{item.description}</p>

      <dl className="resource-details__meta">
        <div>
          <dt>Subject</dt>
          <dd>{item.subject}</dd>
        </div>
        <div>
          <dt>Education level</dt>
          <dd>{item.educationLevel}</dd>
        </div>
        <div>
          <dt>Resource type</dt>
          <dd>{item.resourceType}</dd>
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
          <dt>Uploaded by</dt>
          <dd>{item.uploadedBy || 'Anonymous contributor'}</dd>
        </div>
        <div>
          <dt>Upload date</dt>
          <dd>{formatUploadDate(item.createdAt)}</dd>
        </div>
        <div>
          <dt>File name</dt>
          <dd>{item.fileName}</dd>
        </div>
        <div>
          <dt>File type</dt>
          <dd>{item.fileType}</dd>
        </div>
        <div>
          <dt>File size</dt>
          <dd>{formatFileSize(item.fileSize)}</dd>
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

      <div className="resource-details__actions">
        <a className="resource-card__link" href={viewUrl} target="_blank" rel="noreferrer">
          View / Open Paper
        </a>
        <a className="resource-details__download" href={downloadUrl}>
          Download
        </a>
        <Link className="resources-page__back" to="/resources">
          Back to resources
        </Link>
      </div>

      {isPdf && !previewError ? (
        <section className="resource-details__preview" aria-label="PDF preview">
          <h2>Paper preview</h2>
          <iframe
            title={`${item.title} preview`}
            src={viewUrl}
            onError={() => setPreviewError(true)}
          />
        </section>
      ) : null}
    </main>
  )
}

export default ResourceDetails
