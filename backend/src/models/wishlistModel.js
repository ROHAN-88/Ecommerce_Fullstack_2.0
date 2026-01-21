import { query } from '../config/db.js';

export const createWishlistTable = async () => {
    const text = `
    CREATE TABLE IF NOT EXISTS wishlist (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id)
    );
  `;
    try {
        await query(text);
        console.log('Wishlist table created or already exists');
    } catch (err) {
        console.error('Error creating wishlist table:', err);
    }
};

export const addToWishlist = async (userId, productId) => {
    const text = `
    INSERT INTO wishlist (user_id, product_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, product_id) DO NOTHING
    RETURNING *;
  `;
    const { rows } = await query(text, [userId, productId]);
    return rows[0];
};

export const removeFromWishlist = async (userId, productId) => {
    const text = 'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2';
    await query(text, [userId, productId]);
};

export const getWishlist = async (userId) => {
    const text = `
    SELECT p.*, w.created_at as added_at 
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = $1
    ORDER BY w.created_at DESC;
  `;
    const { rows } = await query(text, [userId]);
    return rows;
};
