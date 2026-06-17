const SORTABLE_FIELDS = {
  users: {
    name: 'u.name',
    email: 'u.email',
    address: 'u.address',
    role: 'u.role',
  },
  stores: {
    name: 's.name',
    email: 's.email',
    address: 's.address',
    rating: 'avg_rating',
    overallRating: 'avg_rating',
  },
  storeOwnerRatings: {
    name: 'u.name',
    email: 'u.email',
    address: 'u.address',
    rating: 'r.rating',
  },
};

function buildSortClause(entity, sortBy, sortOrder = 'asc') {
  const fields = SORTABLE_FIELDS[entity] || {};
  const column = fields[sortBy] || Object.values(fields)[0];
  const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
  return `ORDER BY ${column} ${order}`;
}

function buildFilterClause(filters, columnMap) {
  const conditions = [];
  const values = [];
  let paramIndex = 1;

  Object.entries(filters).forEach(([key, value]) => {
    if (value && columnMap[key]) {
      conditions.push(`${columnMap[key]} ILIKE $${paramIndex}`);
      values.push(`%${value}%`);
      paramIndex += 1;
    }
  });

  return {
    where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    values,
    nextParamIndex: paramIndex,
  };
}

module.exports = { buildSortClause, buildFilterClause, SORTABLE_FIELDS };
