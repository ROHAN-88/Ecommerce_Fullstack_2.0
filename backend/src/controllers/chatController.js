import { findChat, createChat, getMessagesByChatId, createMessage } from '../models/chatModel.js';
import { query } from '../config/db.js';

export const initiateChat = async (req, res) => {
    try {
        const { sellerId, productId } = req.body;
        const buyerId = req.user.id; // From JWT

        if (req.user.role !== 'buyer') {
            // Optional checks
        }

        // Check if chat exists
        let chat = await findChat(buyerId, sellerId, productId);
        if (!chat) {
            chat = await createChat(buyerId, sellerId, productId);
        }

        res.status(200).json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error initiating chat' });
    }
};

export const getChatById = async (req, res) => {
    try {
        const { id } = req.params;
        const text = `
            SELECT c.*, 
                   p.name as product_name, p.image_url as product_image,
                   u_buyer.name as buyer_name, u_seller.name as seller_name
            FROM chats c
            JOIN products p ON c.product_id = p.id
            JOIN users u_buyer ON c.buyer_id = u_buyer.id
            JOIN users u_seller ON c.seller_id = u_seller.id
            WHERE c.id = $1
        `;
        const { rows } = await query(text, [id]);

        if (rows.length === 0) return res.status(404).json({ message: 'Chat not found' });

        const chat = rows[0];
        // Ensure user is part of the chat
        if (chat.buyer_id !== req.user.id && chat.seller_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching chat details' });
    }
};

export const getUserChats = async (req, res) => {
    try {
        const userId = req.user.id;
        const text = `
            SELECT c.*, 
                   p.name as product_name, p.image_url as product_image,
                   u_buyer.name as buyer_name, u_seller.name as seller_name
            FROM chats c
            JOIN products p ON c.product_id = p.id
            JOIN users u_buyer ON c.buyer_id = u_buyer.id
            JOIN users u_seller ON c.seller_id = u_seller.id
            WHERE c.buyer_id = $1 OR c.seller_id = $1
            ORDER BY c.updated_at DESC
        `;
        const { rows } = await query(text, [userId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching chats' });
    }
};

export const getChatMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const chatRes = await query('SELECT * FROM chats WHERE id = $1', [id]);
        const chat = chatRes.rows[0];

        if (!chat) return res.status(404).json({ message: 'Chat not found' });

        if (chat.buyer_id !== req.user.id && chat.seller_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const messages = await getMessagesByChatId(id);
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { id } = req.params; // chat id
        const { content } = req.body;
        const senderId = req.user.id;

        const message = await createMessage(id, senderId, content);

        // Emit real-time event
        const io = req.app.get('io');
        if (io) {
            io.to(id).emit('receive_message', message);
        }

        res.status(201).json(message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error sending message' });
    }
};
