import { Link } from 'react-router-dom';
import SaveButton from './SaveButton.jsx';
import './ResourceCard.css';

const MISSING = 'Not specified';

function displayValue(value) {
  if (value == null) {
    return MISSING;
  }

  const text = String(value).trim();
  return text.length > 0 ? text : MISSING;
}

function tagList(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map((tag) => String(tag).trim())
    .filter((tag) => tag.length > 0);
}

export function ResourceCard({ resource }) {
  if (!resource) {
    return null;
  }

  const tags = tagList(resource.tags);
  const title = displayValue(resource.title);

  return (
    <article className="resource-card">
      <header className="resource-card__header">
        <h2 className="resource-card__title">{title}</h2>
        <SaveButton resource={resource} />
      </header>

      <p className="resource-card__description">
        {displayValue(resource.description)}
      </p>

      <dl className="resource-card__meta">
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
      </dl>

      <section className="resource-card__tags" aria-label="Tags">
        <h3>Tags</h3>
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

      <div className="resource-card__actions">
        <Link className="counter" to={`/resources/${resource.id}`}>
          View Details
        </Link>
        <SaveButton resource={resource} />
      </div>
    </article>
  );
}

export default ResourceCard;
