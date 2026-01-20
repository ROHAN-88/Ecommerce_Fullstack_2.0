import { query } from './db.js';

const debugSchema = async () => {
    try {
        const res = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users';
    `);
        console.log('Current Schema for users table:', res.rows);
    } catch (err) {
        console.error('Error querying schema:', err);
    }
};

debugSchema();
