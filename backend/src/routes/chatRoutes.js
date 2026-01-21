import express from 'express';
import { initiateChat, getUserChats, getChatMessages, sendMessage, getChatById } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken); // Protect all chat routes

router.post('/initiate', initiateChat);
router.get('/', getUserChats);
router.get('/:id', getChatById);
router.get('/:id/messages', getChatMessages);
router.post('/:id/messages', sendMessage);

export default router;
