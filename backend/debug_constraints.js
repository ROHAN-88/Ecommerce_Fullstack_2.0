import { query } from './src/config/db.js';

const debugConstraints = async () => {
    try {
        console.log('Fetching constraints for users table...');
        const res = await query(`
            SELECT conname, pg_get_constraintdef(c.oid) as def
            FROM pg_constraint c
            WHERE conrelid = 'users'::regclass;
        `);
        res.rows.forEach(r => {
            console.log(`Constraint: ${r.conname}`);
            console.log(`Definition: ${r.def}`);
        });
    } catch (err) {
        console.error('Error querying constraints:', err);
    }
};

debugConstraints();
