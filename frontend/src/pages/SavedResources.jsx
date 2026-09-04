import { useMemo, useState } from 'react';
import EmptyResourceState from '../components/EmptyResourceState';
import ResourceList from '../components/ResourceList';
import { LANGUAGES, RESOURCE_TYPES } from '../data/resourceConstants';
import { useSavedResources } from '../hooks/useSavedResources';

function SavedResources() {
  const { savedResources, savedCount } = useSavedResources();
  const [language, setLanguage] = useState('');
  const [type, setType] = useState('');

  const visible = useMemo(
    () =>
      savedResources.filter((resource) => {
        if (language && resource.language !== language) return false;
        if (type && resource.type !== type) return false;
        return true;
      }),
    [savedResources, language, type]
  );

  return (
    <section className="page">
      <div className="container">
        <header className="page-header">
          <p className="eyebrow">Your list</p>
          <h1>Saved resources</h1>
          <p>
            Items you save stay in this browser after refresh. Filter by language or resource type
            when the list grows.
          </p>
        </header>

        <div className="result-bar">
          <p>
            <strong>{savedCount}</strong> saved · <strong>{visible.length}</strong> showing
          </p>
        </div>

        {savedCount > 0 ? (
          <div className="filter-grid saved-filters">
            <label className="field" htmlFor="saved-language">
              <span>Language</span>
              <select
                id="saved-language"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                <option value="">All languages</option>
                {LANGUAGES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="field" htmlFor="saved-type">
              <span>Resource type</span>
              <select id="saved-type" value={type} onChange={(event) => setType(event.target.value)}>
                <option value="">All types</option>
                {RESOURCE_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        {savedCount === 0 ? (
          <EmptyResourceState
            title="Nothing saved yet"
            message="Open a resource you want to revisit and choose Save resource. Your list is stored only on this device."
            actionLabel="Find a resource to save"
            actionTo="/resources"
          />
        ) : visible.length === 0 ? (
          <EmptyResourceState
            title="No saved items match these filters"
            message="Clear the language or type filter to see your full saved list."
            actionTo=""
          />
        ) : (
          <ResourceList resources={visible} saveVariant="remove" />
        )}
      </div>
    </section>
  );
}

export default SavedResources;
