import { query } from './src/config/db.js';

const debugSchema = async () => {
    try {
        const res = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users';
    `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error querying schema:', err);
    }
};

debugSchema();
