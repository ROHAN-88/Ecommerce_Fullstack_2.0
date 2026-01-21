import { query } from './src/config/db.js';

/**
 * Migration script to add location column to products table
 * Run this once: node migrate_add_location.js
 */
async function addLocationColumn() {
    try {
        console.log('Starting migration: Adding location column to products table...');

        // Check if column already exists
        const checkQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='products' AND column_name='location';
        `;
        const checkResult = await query(checkQuery);

        if (checkResult.rows.length > 0) {
            console.log('✓ Location column already exists. Skipping migration.');
            process.exit(0);
        }

        // Add location column
        const alterQuery = `
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS location VARCHAR(255);
        `;
        await query(alterQuery);

        console.log('✓ Successfully added location column to products table');
        console.log('✓ Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('✗ Migration failed:', err);
        process.exit(1);
    }
}

addLocationColumn();
