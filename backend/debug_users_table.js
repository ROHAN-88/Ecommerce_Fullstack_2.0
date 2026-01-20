import { query } from './src/config/db.js';

const debugSchema = async () => {
    try {
        console.log('Querying schema for table: users...');
        const res = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users';
    `);

        if (res.rows.length === 0) {
            console.log('Table "users" NOT FOUND in the database.');
        } else {
            console.log('Current Schema for users table:');
            console.table(res.rows);
        }
    } catch (err) {
        console.error('Error querying schema:', err);
    }
};

debugSchema();
