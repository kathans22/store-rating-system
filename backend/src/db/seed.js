const pool = require('../config/db');
const { hashPassword } = require('../shared/utils/password');

const DEFAULT_PASSWORD = 'Admin@123';

async function seed() {
  const passwordHash = await hashPassword(DEFAULT_PASSWORD);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const adminResult = await client.query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES ($1, $2, $3, $4, 'ADMIN')
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [
        'System Administrator Account',
        'admin@storeplatform.com',
        passwordHash,
        '100 Admin Boulevard, Platform City, PC 10001',
      ]
    );

    const ownerResult = await client.query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES ($1, $2, $3, $4, 'STORE_OWNER')
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [
        'John Smith Store Owner Profile',
        'owner@freshmart.com',
        passwordHash,
        '250 Market Street, Downtown District, City Center 20002',
      ]
    );

    const ownerId = ownerResult.rows[0]?.id;

    if (ownerId) {
      await client.query(
        `INSERT INTO stores (name, email, address, owner_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO NOTHING`,
        [
          'FreshMart Grocery Store',
          'freshmart@store.com',
          '250 Market Street, Downtown District, City Center 20002',
          ownerId,
        ]
      );
    }

    await client.query('COMMIT');
    console.log('Seed data created successfully.');
    console.log('Default credentials for admin and store owner:');
    console.log(`  Email: admin@storeplatform.com | Password: ${DEFAULT_PASSWORD}`);
    console.log(`  Email: owner@freshmart.com | Password: ${DEFAULT_PASSWORD}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to seed database:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
