import axios from '../axios';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    location?: string;
    seller_id: number;
    created_at: string;
}

export interface ProductFilters {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'name' | 'created_at';
    order?: 'asc' | 'desc';
}

export interface CreateProductData {
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    location?: string;
}

// Get all products with optional filters
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
    const response = await axios.get('/products', { params: filters });
    return response.data;
}

// Get single product by ID
export async function getProduct(id: string | number): Promise<Product> {
    const response = await axios.get(`/products/${id}`);
    return response.data;
}

// Get seller's products
export async function getSellerProducts(): Promise<Product[]> {
    const response = await axios.get('/products/my-products');
    return response.data;
}

// Create new product (seller only)
export async function createProduct(data: CreateProductData): Promise<Product> {
    const response = await axios.post('/products', data);
    return response.data;
}
