export default function SortableTable({ columns, rows, sortBy, sortOrder, onSort, emptyMessage }) {
  const handleSort = (key) => {
    if (!key) return;
    if (sortBy === key) {
      onSort(key, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(key, 'asc');
    }
  };

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>
                {col.sortable ? (
                  <button
                    type="button"
                    className="sort-btn"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    {sortBy === col.key && (
                      <span className="sort-indicator">{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-cell">
                {emptyMessage || 'No records found'}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id || row.key}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
