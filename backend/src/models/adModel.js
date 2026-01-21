import { query } from '../config/db.js';

export const createAdsTable = async () => {
    const text = `
    CREATE TABLE IF NOT EXISTS ads (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      link_url VARCHAR(255),
      priority INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
    try {
        await query(text);
        console.log('Ads table created or already exists');
    } catch (err) {
        console.error('Error creating ads table:', err);
    }
};

export const createAd = async (ad) => {
    const { title, image_url, link_url, priority } = ad;
    const text = `
        INSERT INTO ads (title, image_url, link_url, priority)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const { rows } = await query(text, [title, image_url, link_url, priority || 0]);
    return rows[0];
};

export const getAllAds = async () => {
    const text = `SELECT * FROM ads ORDER BY priority DESC, created_at DESC`;
    const { rows } = await query(text);
    return rows;
};

export const getActiveAds = async () => {
    const text = `SELECT * FROM ads WHERE active = TRUE ORDER BY priority DESC, created_at DESC`;
    const { rows } = await query(text);
    return rows;
};

export const toggleAdStatus = async (id, active) => {
    const text = `UPDATE ads SET active = $1 WHERE id = $2 RETURNING *`;
    const { rows } = await query(text, [active, id]);
    return rows[0];
};

export const deleteAd = async (id) => {
    const text = `DELETE FROM ads WHERE id = $1 RETURNING *`;
    const { rows } = await query(text, [id]);
    return rows[0];
};
