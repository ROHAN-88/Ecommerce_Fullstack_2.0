import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getWishlist, addToWishlist, removeFromWishlist } from '../models/wishlistModel.js';

const router = express.Router();

router.use(authenticateToken);

// Get User's Wishlist
router.get('/', async (req, res) => {
    try {
        const wishlist = await getWishlist(req.user.id);
        res.json(wishlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
});

// Add to Wishlist
router.post('/', async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: 'ProductId is required' });

        await addToWishlist(req.user.id, productId);
        res.status(201).json({ message: 'Added to wishlist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding to wishlist' });
    }
});

// Remove from Wishlist
router.delete('/:productId', async (req, res) => {
    try {
        await removeFromWishlist(req.user.id, req.params.productId);
        res.json({ message: 'Removed from wishlist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error removing from wishlist' });
    }
});

export default router;
