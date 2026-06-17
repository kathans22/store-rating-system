const pool = require('../../config/db');
const { buildSortClause } = require('../../shared/utils/queryHelpers');

class RatingRepository {
  async countAll() {
    const result = await pool.query('SELECT COUNT(*)::int AS count FROM ratings');
    return result.rows[0].count;
  }

  async upsert(userId, storeId, rating) {
    const result = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id)
       DO UPDATE SET rating = EXCLUDED.rating, updated_at = NOW()
       RETURNING id, user_id, store_id, rating`,
      [userId, storeId, rating]
    );
    return result.rows[0];
  }

  async getAverageByStoreId(storeId) {
    const result = await pool.query(
      `SELECT ROUND(AVG(rating)::numeric, 2) AS avg_rating
       FROM ratings WHERE store_id = $1`,
      [storeId]
    );
    const value = result.rows[0]?.avg_rating;
    return value ? parseFloat(value) : null;
  }

  async findRatersByStoreId(storeId, sortBy, sortOrder) {
    const sortClause = buildSortClause('storeOwnerRatings', sortBy, sortOrder);
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.address, r.rating, r.updated_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = $1
       ${sortClause}`,
      [storeId]
    );
    return result.rows;
  }
}

module.exports = new RatingRepository();
