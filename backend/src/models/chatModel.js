import { query } from '../config/db.js';

export const createChatTables = async () => {
    await query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    const chatsTable = `
    CREATE TABLE IF NOT EXISTS chats (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(buyer_id, seller_id, product_id)
    );
  `;

    const messagesTable = `
    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
      sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

    try {
        await query(chatsTable);
        await query(messagesTable);
        console.log('Chat and Messages tables created or already exist');
    } catch (err) {
        console.error('Error creating chat tables:', err);
    }
};

export const findChat = async (buyerId, sellerId, productId) => {
    const text = `SELECT * FROM chats WHERE buyer_id = $1 AND seller_id = $2 AND product_id = $3`;
    const { rows } = await query(text, [buyerId, sellerId, productId]);
    return rows[0];
};

export const createChat = async (buyerId, sellerId, productId) => {
    const text = `
        INSERT INTO chats (buyer_id, seller_id, product_id)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const { rows } = await query(text, [buyerId, sellerId, productId]);
    return rows[0];
};

export const createMessage = async (chatId, senderId, content) => {
    const text = `
        INSERT INTO messages (chat_id, sender_id, content)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const { rows } = await query(text, [chatId, senderId, content]);
    return rows[0];
};

export const getMessagesByChatId = async (chatId) => {
    const text = `SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC`;
    const { rows } = await query(text, [chatId]);
    return rows;
};
