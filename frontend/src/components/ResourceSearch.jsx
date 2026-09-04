function ResourceSearch({ query, onQueryChange }) {
  return (
    <div className="resource-search">
      <label className="resource-search__label" htmlFor="resource-search-input">
        Search resources
      </label>
      <div className="resource-search__field">
        <input
          id="resource-search-input"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search resources..."
          autoComplete="off"
        />
        {query ? (
          <button
            type="button"
            className="resource-search__clear"
            onClick={() => onQueryChange('')}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default ResourceSearch
