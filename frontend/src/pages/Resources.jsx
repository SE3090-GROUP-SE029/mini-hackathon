import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { deleteResource, fetchResources } from '../api/resourcesApi';
import EmptyResourceState from '../components/EmptyResourceState';
import LoadingState from '../components/LoadingState';
import ResourceFilters from '../components/ResourceFilters';
import ResourceList from '../components/ResourceList';
import ResourceSearch from '../components/ResourceSearch';

const initialFilters = {
  search: '',
  subject: '',
  educationLevel: '',
  sort: 'newest',
};

function Resources() {
  const location = useLocation();
  const [filters, setFilters] = useState(initialFilters);
  const [resources, setResources] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [source, setSource] = useState('api');
  const [loadedFilters, setLoadedFilters] = useState(null);
  const [notice, setNotice] = useState(location.state?.notice || '');
  const [listError, setListError] = useState('');

  useEffect(() => {
    let active = true;

    fetchResources(filters).then((result) => {
      if (!active) return;
      setResources(result.resources);
      setResultCount(result.resultCount);
      setSource(result.source);
      setLoadedFilters(filters);
    });

    return () => {
      active = false;
    };
  }, [filters]);

  const isLoading = loadedFilters !== filters;

  const hasActiveFilters = useMemo(
    () => Boolean(filters.search || filters.subject || filters.educationLevel),
    [filters]
  );

  const handleDelete = async (resource) => {
    const confirmed = window.confirm(
      `Delete “${resource.title}”? The attached file will be removed as well.`
    );
    if (!confirmed) return;

    try {
      await deleteResource(resource.id);
      setResources((current) => current.filter((item) => item.id !== resource.id));
      setResultCount((count) => Math.max(0, count - 1));
      setNotice('Resource deleted.');
      setListError('');
    } catch (error) {
      setListError(error.message || 'The resource could not be deleted.');
    }
  };

  return (
    <section className="page">
      <div className="container">
        <header className="page-header page-header-split">
          <div>
            <p className="eyebrow">Resource discovery</p>
            <h1>Find Sri Lankan study materials in one place</h1>
            <p>
              Search by title, description or subject. Filter by subject and education level, then
              sort A–Z or by newest uploads.
            </p>
          </div>
          <Link className="btn btn-primary" to="/resources/new">
            Add Educational Resource
          </Link>
        </header>

        {notice ? (
          <p className="form-banner form-banner-success" role="status">
            {notice}
          </p>
        ) : null}
        {listError ? (
          <p className="form-banner form-banner-error" role="alert">
            {listError}
          </p>
        ) : null}

        <div className="toolbar">
          <ResourceSearch
            value={filters.search}
            onChange={(search) => setFilters((current) => ({ ...current, search }))}
          />
          <ResourceFilters filters={filters} onChange={setFilters} />
        </div>

        <div className="result-bar">
          <p>
            <strong>{resultCount}</strong> resource{resultCount === 1 ? '' : 's'} found
            {source === 'local' ? ' · showing local catalogue' : ''}
          </p>
          {hasActiveFilters ? (
            <button type="button" className="text-button" onClick={() => setFilters(initialFilters)}>
              Clear search and filters
            </button>
          ) : null}
        </div>

        {isLoading ? (
          <LoadingState label="Loading the catalogue…" />
        ) : resources.length === 0 ? (
          <EmptyResourceState />
        ) : (
          <ResourceList resources={resources} showManageActions onDelete={handleDelete} />
        )}
      </div>
    </section>
  );
}

export default Resources;
