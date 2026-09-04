import { Link, useParams } from 'react-router-dom';
import SaveButton from '../components/SaveButton.jsx';
import { getResourceById } from '../data/resources.js';
import './ResourceDetails.css';

const MISSING = 'Not specified';

function displayValue(value) {
  if (value == null) {
    return MISSING;
  }

  const text = String(value).trim();
  return text.length > 0 ? text : MISSING;
}

function getSafeExternalUrl(url) {
  if (typeof url !== 'string' || url.trim().length === 0) {
    return null;
  }

  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

function tagList(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map((tag) => String(tag).trim())
    .filter((tag) => tag.length > 0);
}

export function ResourceDetails() {
  const { id } = useParams();
  const resource = getResourceById(id);

  if (!resource) {
    return (
      <section className="resource-details resource-details--missing">
        <h1>Resource not found</h1>
        <p>
          This resource ID is invalid or no longer available in the catalogue.
        </p>
        <Link className="counter resource-details__back" to="/resources">
          Back to Resources
        </Link>
      </section>
    );
  }

  const safeUrl = getSafeExternalUrl(resource.url);
  const tags = tagList(resource.tags);

  return (
    <article className="resource-details">
      <Link className="resource-details__back-link" to="/resources">
        Back to Resources
      </Link>

      <header className="resource-details__header">
        <h1>{displayValue(resource.title)}</h1>
        <SaveButton resource={resource} />
      </header>

      <p className="resource-details__description">
        {displayValue(resource.description)}
      </p>

      <dl className="resource-details__meta">
        <div>
          <dt>Subject</dt>
          <dd>{displayValue(resource.subject)}</dd>
        </div>
        <div>
          <dt>Education level</dt>
          <dd>{displayValue(resource.level)}</dd>
        </div>
        <div>
          <dt>Language</dt>
          <dd>{displayValue(resource.language)}</dd>
        </div>
        <div>
          <dt>Resource type</dt>
          <dd>{displayValue(resource.type)}</dd>
        </div>
        <div>
          <dt>Provider</dt>
          <dd>{displayValue(resource.provider)}</dd>
        </div>
        <div>
          <dt>External resource URL</dt>
          <dd>
            {safeUrl ? (
              <a href={safeUrl} target="_blank" rel="noopener noreferrer">
                {safeUrl}
              </a>
            ) : (
              'No valid URL available'
            )}
          </dd>
        </div>
      </dl>

      <section className="resource-details__tags" aria-label="Tags">
        <h2>Tags</h2>
        {tags.length > 0 ? (
          <ul>
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : (
          <p>{MISSING}</p>
        )}
      </section>

      <div className="resource-details__actions">
        <SaveButton resource={resource} />
        {safeUrl ? (
          <a
            className="counter"
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Resource
          </a>
        ) : (
          <button type="button" className="counter" disabled>
            Open Resource
          </button>
        )}
      </div>
    </article>
  );
}

export default ResourceDetails;
