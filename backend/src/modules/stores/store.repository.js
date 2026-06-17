const pool = require('../../config/db');
const { buildSortClause, buildFilterClause } = require('../../shared/utils/queryHelpers');

const STORE_FILTER_MAP = {
  name: 's.name',
  email: 's.email',
  address: 's.address',
};

class StoreRepository {
  async findByEmail(email) {
    const result = await pool.query('SELECT id FROM stores WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT id, name, email, address, owner_id FROM stores WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByOwnerId(ownerId) {
    const result = await pool.query(
      'SELECT id, name FROM stores WHERE owner_id = $1 LIMIT 1',
      [ownerId]
    );
    return result.rows[0] || null;
  }

  async create({ name, email, address, ownerId }) {
    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, address, owner_id`,
      [name, email, address, ownerId]
    );
    return result.rows[0];
  }

  async countAll() {
    const result = await pool.query('SELECT COUNT(*)::int AS count FROM stores');
    return result.rows[0].count;
  }

  async findAllWithRatings(filters, sortBy, sortOrder) {
    const { where, values } = buildFilterClause(filters, STORE_FILTER_MAP);
    const sortClause = buildSortClause('stores', sortBy, sortOrder);

    const result = await pool.query(
      `SELECT s.id, s.name, s.email, s.address,
              ROUND(AVG(r.rating)::numeric, 2) AS rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       ${where}
       GROUP BY s.id
       ${sortClause}`,
      values
    );
    return result.rows;
  }

  async findAllForUser(userId, filters, sortBy, sortOrder) {
    const { where, values, nextParamIndex } = buildFilterClause(filters, {
      name: 's.name',
      address: 's.address',
    });
    const sortClause = buildSortClause('stores', sortBy, sortOrder);

    const result = await pool.query(
      `SELECT s.id, s.name, s.address,
              ROUND(AVG(r.rating)::numeric, 2) AS overall_rating,
              ur.rating AS user_rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $${nextParamIndex}
       ${where}
       GROUP BY s.id, ur.rating
       ${sortClause}`,
      [...values, userId]
    );
    return result.rows;
  }

  async getAverageRatingByOwnerId(ownerId) {
    const result = await pool.query(
      `SELECT ROUND(AVG(r.rating)::numeric, 2) AS avg_rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id = $1`,
      [ownerId]
    );
    const value = result.rows[0]?.avg_rating;
    return value ? parseFloat(value) : null;
  }
}

module.exports = new StoreRepository();
