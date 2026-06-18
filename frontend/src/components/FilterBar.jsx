export default function FilterBar({ filters, onChange, onReset, fields }) {
  return (
    <div className="filter-bar">
      {fields.map((field) => (
        <label key={field.name} className="filter-field">
          <span>{field.label}</span>
          {field.type === 'select' ? (
            <select
              value={filters[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
            >
              <option value="">All</option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={filters[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder || `Filter by ${field.label}`}
            />
          )}
        </label>
      ))}
      <button type="button" className="btn btn-secondary" onClick={onReset}>
        Reset Filters
      </button>
    </div>
  );
}
