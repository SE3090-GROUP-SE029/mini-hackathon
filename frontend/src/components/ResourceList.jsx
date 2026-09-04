import ResourceCard from './ResourceCard.jsx'

function ResourceList({ resources }) {
  return (
    <section className="resources-grid" aria-label="Resource results">
      {resources.map((resource) => (
        <ResourceCard key={resource.id || resource._id} resource={resource} />
      ))}
    </section>
  )
}

export function ResourceListSkeleton() {
  return (
    <section className="resources-grid" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <article key={index} className="resource-card resource-card--skeleton">
          <div className="skeleton-line skeleton-line--chip" />
          <div className="skeleton-line skeleton-line--title" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line--short" />
        </article>
      ))}
    </section>
  )
}

export default ResourceList
