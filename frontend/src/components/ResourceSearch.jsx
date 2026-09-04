function ResourceSearch({ value, onChange }) {
  return (
    <label className="field search-field">
      <span>Search resources</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title, description or subject"
        autoComplete="off"
      />
    </label>
  );
}

export default ResourceSearch;
