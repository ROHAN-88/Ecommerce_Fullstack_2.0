import express from 'express';
import { createAd, getAllAds, getActiveAds, toggleAdStatus, deleteAd } from '../models/adModel.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get active ads for homepage
router.get('/active', async (req, res) => {
    try {
        const ads = await getActiveAds();
        res.json(ads);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching ads' });
    }
});

// Admin Routes
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

router.post('/', async (req, res) => {
    try {
        const ad = await createAd(req.body);
        res.status(201).json(ad);
    } catch (err) {
        res.status(500).json({ message: 'Error creating ad' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const ads = await getAllAds();
        res.json(ads);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching all ads' });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { active } = req.body;
        const ad = await toggleAdStatus(req.params.id, active);
        res.json(ad);
    } catch (err) {
        res.status(500).json({ message: 'Error updating ad status' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteAd(req.params.id);
        res.json({ message: 'Ad deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting ad' });
    }
});

export default router;
