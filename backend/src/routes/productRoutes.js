import express from 'express';
import { getProducts, getProduct, addProduct } from '../controllers/productController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authenticateToken, addProduct);

export default router;
