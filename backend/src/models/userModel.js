import { query } from '../config/db.js';

// Initialize Users Table
export const createUsersTable = async () => {
  const text = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255),
      role VARCHAR(20) CHECK (role IN ('buyer', 'seller', 'admin')) NOT NULL DEFAULT 'buyer',
      provider VARCHAR(20) DEFAULT 'local',
      provider_id VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await query(text);
    console.log('Users table created or already exists');

    // Migration: Rename password_hash to password if it exists
    try {
      const checkRes = await query("SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='password_hash'");
      if (checkRes.rows.length > 0) {
        console.log('Renaming password_hash to password...');
        await query('ALTER TABLE users RENAME COLUMN password_hash TO password');
      }
    } catch (e) {
      console.log('Migration warning:', e.message);
    }

    // Migration: Ensure name column exists
    try {
      await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100)');
    } catch (e) {
      console.log('Migration warning (name):', e.message);
    }

    // Simple migration check (idempotent-ish)
    await query(`ALTER TABLE users ALTER COLUMN password DROP NOT NULL;`);
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(20) DEFAULT 'local';`);
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255);`);
  } catch (err) {
    console.error('Error creating/updating users table:', err);
  }
};

export const findUserByEmail = async (email) => {
  const text = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await query(text, [email]);
  return rows[0];
};

export const createUser = async ({ name, email, password, role = 'buyer', provider = 'local', provider_id = null }) => {
  console.log('DEBUG CHECK createUser:', { name, email, role, provider });
  const text = `
    INSERT INTO users (name, email, password, role, provider, provider_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, name, email, role, provider, created_at;
  `;
  const { rows } = await query(text, [name, email, password, role, provider, provider_id]);
  return rows[0];
};
