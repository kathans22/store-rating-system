const pool = require('../../config/db');
const { buildSortClause, buildFilterClause } = require('../../shared/utils/queryHelpers');
const { ADMIN_MANAGED_ROLES } = require('../../shared/constants/roles');

const USER_FILTER_MAP = {
  name: 'u.name',
  email: 'u.email',
  address: 'u.address',
  role: 'u.role::text',
};

class UserRepository {
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT id, name, email, address, role, password_hash FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT id, name, email, address, role FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findPasswordHashById(id) {
    const result = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0]?.password_hash || null;
  }

  async create({ name, email, address, passwordHash, role }) {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, address, role`,
      [name, email, passwordHash, address, role]
    );
    return result.rows[0];
  }

  async updatePassword(id, passwordHash) {
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, id]
    );
  }

  async countAll() {
    const result = await pool.query('SELECT COUNT(*)::int AS count FROM users');
    return result.rows[0].count;
  }

  async findManagedUsers(filters, sortBy, sortOrder) {
    const { where, values } = buildFilterClause(filters, USER_FILTER_MAP);
    const sortClause = buildSortClause('users', sortBy, sortOrder);
    const roleFilter = `u.role IN ('${ADMIN_MANAGED_ROLES.join("','")}')`;
    const fullWhere = where ? `${where} AND ${roleFilter}` : `WHERE ${roleFilter}`;

    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.address, u.role
       FROM users u
       ${fullWhere}
       ${sortClause}`,
      values
    );
    return result.rows;
  }

  async findAll(filters, sortBy, sortOrder) {
    const { where, values } = buildFilterClause(filters, USER_FILTER_MAP);
    const sortClause = buildSortClause('users', sortBy, sortOrder);

    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.address, u.role
       FROM users u
       ${where}
       ${sortClause}`,
      values
    );
    return result.rows;
  }

  async findStoreOwners() {
    const result = await pool.query(
      `SELECT id, name, email FROM users WHERE role = 'STORE_OWNER' ORDER BY name ASC`
    );
    return result.rows;
  }

  async existsStoreOwnerById(id) {
    const result = await pool.query(
      "SELECT id FROM users WHERE id = $1 AND role = 'STORE_OWNER'",
      [id]
    );
    return result.rows.length > 0;
  }
}

module.exports = new UserRepository();
