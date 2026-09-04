import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ResourceCard from '../components/ResourceCard.jsx';
import { getResourceById } from '../data/resources.js';
import { useSavedResources } from '../hooks/useSavedResources.js';
import './SavedResources.css';

const LANGUAGE_OPTIONS = [
  { value: '', label: 'All Languages' },
  { value: 'English', label: 'English' },
  { value: 'Sinhala', label: 'Sinhala' },
  { value: 'Tamil', label: 'Tamil' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'past-papers', label: 'Past Papers' },
  { value: 'notes', label: 'Notes' },
  { value: 'videos', label: 'Videos' },
  { value: 'courses', label: 'Courses' },
  { value: 'practice', label: 'Practice' },
];

function normalizeLanguage(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function normalizeType(value) {
  const text = String(value ?? '')
    .trim()
    .toLowerCase();

  if (text === 'past paper' || text === 'past papers') {
    return 'past-papers';
  }
  if (text === 'note' || text === 'notes') {
    return 'notes';
  }
  if (text === 'video' || text === 'videos') {
    return 'videos';
  }
  if (text === 'course' || text === 'courses') {
    return 'courses';
  }
  if (text === 'practice') {
    return 'practice';
  }

  return text.replace(/\s+/g, '-');
}

function hydrateResource(savedItem) {
  const canonical = getResourceById(savedItem?.id);
  return canonical ?? savedItem;
}

export function SavedResources() {
  const { savedResources, savedCount } = useSavedResources();
  const [languageFilter, setLanguageFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const hydratedResources = useMemo(
    () => savedResources.map(hydrateResource),
    [savedResources],
  );

  const hasActiveFilters = languageFilter !== '' || typeFilter !== '';

  const filteredResources = useMemo(() => {
    return hydratedResources.filter((resource) => {
      const matchesLanguage =
        languageFilter === '' ||
        normalizeLanguage(resource.language) ===
          normalizeLanguage(languageFilter);
      const matchesType =
        typeFilter === '' || normalizeType(resource.type) === typeFilter;

      return matchesLanguage && matchesType;
    });
  }, [hydratedResources, languageFilter, typeFilter]);

  function clearFilters() {
    setLanguageFilter('');
    setTypeFilter('');
  }

  const showEmptySaved = savedCount === 0;
  const showEmptyFilters =
    savedCount > 0 && filteredResources.length === 0;

  return (
    <section className="saved-resources">
      <header className="saved-resources__header">
        <h1>Saved Resources</h1>
        <p className="saved-resources__subtitle">
          Keep useful learning resources in one place for later.
        </p>
        <p className="saved-resources__count" aria-live="polite">
          {savedCount} resources saved
        </p>
      </header>

      {savedCount > 0 ? (
        <form
          className="saved-resources__filters"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="saved-resources__filter">
            <span>Language</span>
            <select
              value={languageFilter}
              onChange={(event) => setLanguageFilter(event.target.value)}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="saved-resources__filter">
            <span>Resource Type</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="counter"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
          >
            Clear Filters
          </button>
        </form>
      ) : null}

      {showEmptySaved ? (
        <div className="saved-resources__empty">
          <h2>No saved resources yet</h2>
          <p>
            Save useful learning resources and they&apos;ll be available here
            whenever you need them.
          </p>
          <Link className="counter" to="/resources">
            Explore Resources
          </Link>
        </div>
      ) : null}

      {showEmptyFilters ? (
        <div className="saved-resources__empty">
          <h2>No matching resources</h2>
          <p>No saved resources match the selected filters.</p>
          <button type="button" className="counter" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      ) : null}

      {!showEmptySaved && !showEmptyFilters ? (
        <ul className="saved-resources__list">
          {filteredResources.map((resource) => (
            <li key={resource.id}>
              <ResourceCard resource={resource} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default SavedResources;
