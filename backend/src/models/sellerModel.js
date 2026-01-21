import { query, pool } from '../config/db.js';
import bcrypt from 'bcrypt';

export const createSellerTables = async () => {
    const text = `
    CREATE TABLE IF NOT EXISTS seller_details (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
      phone VARCHAR(20) NOT NULL,
      citizenship_id VARCHAR(50) NOT NULL,
      pan_number VARCHAR(20),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
    try {
        await query(text);
        console.log('Seller Details table created or already exists');
    } catch (err) {
        console.error('Error creating seller_details table:', err);
    }
};

export const createSeller = async ({ name, email, password, phone, citizenship_id, pan_number }) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Create User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userText = `
            INSERT INTO users (name, email, password, role, status)
            VALUES ($1, $2, $3, 'seller', 'active')
            RETURNING id, name, email;
        `;
        const userRes = await client.query(userText, [name, email, hashedPassword]);
        const user = userRes.rows[0];

        // 2. Create Seller Details
        const sellerText = `
            INSERT INTO seller_details (user_id, phone, citizenship_id, pan_number)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        await client.query(sellerText, [user.id, phone, citizenship_id, pan_number]);

        await client.query('COMMIT');
        return user;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};
