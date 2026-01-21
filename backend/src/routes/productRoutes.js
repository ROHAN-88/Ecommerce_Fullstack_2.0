import express from 'express';
import { getProducts, getProduct, addProduct, getSellerProducts } from '../controllers/productController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/my-products', authenticateToken, getSellerProducts);
router.get('/:id', getProduct);
router.post('/', authenticateToken, addProduct);

export default router;
