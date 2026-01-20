import { query } from '../config/db.js';

export const createProductsTable = async () => {
    const text = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      category VARCHAR(100),
      image_url VARCHAR(255),
      seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`;

    const indices = `
        CREATE INDEX IF NOT EXISTS idx_products_name
ON products USING GIN(to_tsvector('english', name));
        CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
        CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
    `;
    try {
        await query(text);
        await query(indices);
        console.log('Products table and indices created or already exist');
    } catch (err) {
        console.error('Error creating products table:', err);
    }
};

export const createProduct = async (product) => {
    const { name, description, price, category, image_url, seller_id } = product;
    const text = `
        INSERT INTO products (name, description, price, category, image_url, seller_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const { rows } = await query(text, [name, description, price, category, image_url, seller_id]);
    return rows[0];
};

export const getAllProducts = async () => {
    const text = `SELECT * FROM products ORDER BY created_at DESC`;
    const { rows } = await query(text);
    return rows;
};

export const getProductsWithFilters = async ({ search, category, minPrice, maxPrice, sortBy, order }) => {
    let text = `SELECT * FROM products WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (search) {
        text += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    if (category) {
        text += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
    }

    if (minPrice) {
        text += ` AND price >= $${paramIndex}`;
        params.push(minPrice);
        paramIndex++;
    }

    if (maxPrice) {
        text += ` AND price <= $${paramIndex}`;
        params.push(maxPrice);
        paramIndex++;
    }

    let sortColumn = 'created_at';
    if (sortBy === 'price') sortColumn = 'price';
    if (sortBy === 'name') sortColumn = 'name';

    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

    text += ` ORDER BY ${sortColumn} ${sortOrder}`;

    const { rows } = await query(text, params);
    return rows;
};

export const getProductById = async (id) => {
    const text = `SELECT * FROM products WHERE id = $1`;
    const { rows } = await query(text, [id]);
    return rows[0];
};
