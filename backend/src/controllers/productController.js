import { createProduct, getAllProducts, getProductById, getProductsWithFilters, getProductsBySellerId } from '../models/productModel.js';

export const getProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, sortBy, order } = req.query;

        let products;
        if (search || category || minPrice || maxPrice || sortBy) {
            products = await getProductsWithFilters({ search, category, minPrice, maxPrice, sortBy, order });
        } else {
            products = await getAllProducts();
        }

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching products' });
    }
};

export const getProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        const product = await getProductById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching product' });
    }
};

export const getSellerProducts = async (req, res) => {
    try {
        if (req.user.role !== 'seller') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const products = await getProductsBySellerId(req.user.id);
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching seller products' });
    }
};

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, image_url, location } = req.body;
        const seller_id = req.user.id; // From JWT

        if (req.user.role !== 'seller') {
            return res.status(403).json({ message: 'Only sellers can add products' });
        }

        const newProduct = await createProduct({ name, description, price, category, image_url, location, seller_id });
        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding product' });
    }
};
