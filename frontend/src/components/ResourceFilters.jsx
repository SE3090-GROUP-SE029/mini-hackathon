import {
  EDUCATION_LEVELS,
  LANGUAGES,
  RESOURCE_TYPES,
  SORT_OPTIONS,
  SUBJECTS,
} from '../data/resourceConstants';

function SelectField({ id, label, value, onChange, options, includeAll = true }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {includeAll ? <option value="">All</option> : null}
        {options.map((option) => {
          const item = typeof option === 'string' ? { value: option, label: option } : option;
          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

function ResourceFilters({ filters, onChange, showLanguage = false, showType = false }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="filter-grid">
      <SelectField
        id="filter-subject"
        label="Subject"
        value={filters.subject}
        onChange={(value) => update('subject', value)}
        options={SUBJECTS}
      />
      <SelectField
        id="filter-level"
        label="Education level"
        value={filters.educationLevel}
        onChange={(value) => update('educationLevel', value)}
        options={EDUCATION_LEVELS}
      />
      {showLanguage ? (
        <SelectField
          id="filter-language"
          label="Language"
          value={filters.language}
          onChange={(value) => update('language', value)}
          options={LANGUAGES}
        />
      ) : null}
      {showType ? (
        <SelectField
          id="filter-type"
          label="Resource type"
          value={filters.type}
          onChange={(value) => update('type', value)}
          options={RESOURCE_TYPES}
        />
      ) : null}
      <SelectField
        id="filter-sort"
        label="Sort"
        value={filters.sort}
        onChange={(value) => update('sort', value)}
        options={SORT_OPTIONS}
        includeAll={false}
      />
    </div>
  );
}

export default ResourceFilters;
