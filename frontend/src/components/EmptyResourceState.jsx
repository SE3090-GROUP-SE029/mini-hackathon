import { Link } from 'react-router-dom'

function EmptyResourceState({ variant = 'no-results', onClearFilters, onRetry }) {
  if (variant === 'loading') {
    return (
      <section className="resources-empty" role="status" aria-live="polite">
        <h2>Loading educational resources...</h2>
        <p>Please wait while we fetch papers and study materials.</p>
      </section>
    )
  }

  if (variant === 'error') {
    return (
      <section className="resources-empty" role="alert">
        <h2>We couldn't load the resources.</h2>
        <p>Please try again.</p>
        {onRetry ? (
          <button type="button" onClick={onRetry}>
            Retry
          </button>
        ) : null}
      </section>
    )
  }

  if (variant === 'empty-catalogue') {
    return (
      <section className="resources-empty" role="status">
        <h2>No educational resources yet</h2>
        <p>Be the first person to contribute a useful paper or study resource.</p>
        <Link className="resource-card__link" to="/upload">
          Upload Resource
        </Link>
      </section>
    )
  }

  return (
    <section className="resources-empty" role="status">
      <h2>No resources found</h2>
      <p>We couldn't find any resources matching your search.</p>
      <p className="resources-empty__hints">
        Try:
        <br />
        • using different keywords
        <br />
        • removing some filters
        <br />
        • selecting another subject
      </p>
      {onClearFilters ? (
        <button type="button" onClick={onClearFilters}>
          Clear Filters
        </button>
      ) : null}
    </section>
  )
}

export default EmptyResourceState
