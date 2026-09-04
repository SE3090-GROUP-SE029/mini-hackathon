import { SORT_OPTIONS } from '../data/resourceConstants.js'

function ResourceFilters({
  options,
  subject,
  level,
  language,
  type,
  sortBy,
  onSubjectChange,
  onLevelChange,
  onLanguageChange,
  onTypeChange,
  onSortChange,
  onReset,
  canReset,
}) {
  return (
    <section className="resource-filters" aria-label="Resource filters">
      <FilterSelect
        id="filter-subject"
        label="Subject"
        allLabel="All Subjects"
        value={subject}
        onChange={onSubjectChange}
        options={options.subjects}
      />
      <FilterSelect
        id="filter-level"
        label="Education level"
        allLabel="All Levels"
        value={level}
        onChange={onLevelChange}
        options={options.levels}
      />
      <FilterSelect
        id="filter-type"
        label="Resource type"
        allLabel="All Types"
        value={type}
        onChange={onTypeChange}
        options={options.types}
      />
      <FilterSelect
        id="filter-language"
        label="Language"
        allLabel="All Languages"
        value={language}
        onChange={onLanguageChange}
        options={options.languages}
      />
      <label className="resource-filters__control" htmlFor="filter-sort">
        <span>Sort</span>
        <select
          id="filter-sort"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className="resource-filters__reset"
        onClick={onReset}
        disabled={!canReset}
      >
        Clear filters
      </button>
    </section>
  )
}

function FilterSelect({ id, label, allLabel, value, onChange, options }) {
  return (
    <label className="resource-filters__control" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export default ResourceFilters
