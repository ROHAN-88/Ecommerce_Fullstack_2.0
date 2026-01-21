import express from 'express';
import { getAllUsers, updateUserStatus, getUserStats } from '../models/userModel.js';
import { query } from '../config/db.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// User Management
router.get('/users', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

router.put('/users/:id/status', async (req, res) => {
    try {
        const { status } = req.body; // active, suspended, banned
        if (!['active', 'suspended', 'banned'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const user = await updateUserStatus(req.params.id, status);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user status' });
    }
});

// Analytics
router.get('/analytics', async (req, res) => {
    try {
        const userStats = await getUserStats();

        const productStats = await query('SELECT COUNT(*) FROM products');
        const orderStats = await query('SELECT COUNT(*) FROM users'); // Mock (since we don't have orders table yet or just use dummy)

        // Basic stats
        res.json({
            users: userStats,
            products: parseInt(productStats.rows[0].count),
            orders: 0 // Placeholder
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching analytics' });
    }
});

export default router;
