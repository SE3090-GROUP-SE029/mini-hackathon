import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchResources } from '../api/resourcesApi.js'
import EmptyResourceState from '../components/EmptyResourceState.jsx'
import ResourceFilters from '../components/ResourceFilters.jsx'
import ResourceList, { ResourceListSkeleton } from '../components/ResourceList.jsx'
import ResourceSearch from '../components/ResourceSearch.jsx'
import {
  getFilterOptions,
  getResourceCount,
  getResourceCountLabel,
  hasActiveFilters,
  processResources,
} from '../utils/resourceUtils.js'

const INITIAL_FILTERS = {
  query: '',
  subject: 'all',
  level: 'all',
  language: 'all',
  type: 'all',
  sortBy: 'newest',
}

function Resources() {
  const [resources, setResources] = useState([])
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [status, setStatus] = useState('loading')
  const filterOptions = useMemo(() => getFilterOptions(), [])

  async function loadResources() {
    setStatus('loading')
    try {
      const data = await fetchResources()
      setResources(Array.isArray(data) ? data : [])
      setStatus('ready')
    } catch {
      setResources([])
      setStatus('error')
    }
  }

  useEffect(() => {
    loadResources()
  }, [])

  const visibleResources = useMemo(
    () => processResources(resources, filters),
    [resources, filters],
  )

  const filtersActive = hasActiveFilters(filters)
  const matchCount = getResourceCount(visibleResources)

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  function resetFilters() {
    setFilters(INITIAL_FILTERS)
  }

  const showCatalogueEmpty = status === 'ready' && resources.length === 0
  const showNoResults =
    status === 'ready' && resources.length > 0 && visibleResources.length === 0

  return (
    <main className="resources-page">
      <header className="resources-page__header">
        <p className="resources-page__eyebrow">EduLanka catalogue</p>
        <h1>Educational Resources</h1>
        <p className="resources-page__lead">
          Find papers, notes and study materials for Sri Lankan students. Search by
          title, description, or subject, then filter by level, type, and language.
        </p>
        <Link className="resources-page__upload-link" to="/upload">
          Upload Resource
        </Link>
      </header>

      <ResourceSearch
        query={filters.query}
        onQueryChange={(query) => updateFilter('query', query)}
      />

      <ResourceFilters
        options={filterOptions}
        subject={filters.subject}
        level={filters.level}
        language={filters.language}
        type={filters.type}
        sortBy={filters.sortBy}
        onSubjectChange={(subject) => updateFilter('subject', subject)}
        onLevelChange={(level) => updateFilter('level', level)}
        onLanguageChange={(language) => updateFilter('language', language)}
        onTypeChange={(type) => updateFilter('type', type)}
        onSortChange={(sortBy) => updateFilter('sortBy', sortBy)}
        onReset={resetFilters}
        canReset={filtersActive || filters.sortBy !== INITIAL_FILTERS.sortBy}
      />

      <p className="resources-page__count" aria-live="polite">
        {status === 'loading' ? 'Loading educational resources...' : getResourceCountLabel(matchCount)}
      </p>

      {status === 'loading' ? <ResourceListSkeleton /> : null}
      {status === 'error' ? <EmptyResourceState variant="error" onRetry={loadResources} /> : null}
      {showCatalogueEmpty ? <EmptyResourceState variant="empty-catalogue" /> : null}
      {showNoResults ? (
        <EmptyResourceState variant="no-results" onClearFilters={resetFilters} />
      ) : null}
      {status === 'ready' && visibleResources.length > 0 ? (
        <ResourceList resources={visibleResources} />
      ) : null}
    </main>
  )
}

export default Resources
