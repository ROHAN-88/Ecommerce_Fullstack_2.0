'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';

export default function SellerDashboard() {
    const { user, token } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [stats, setStats] = useState({ views: 0, sales: 0, orders: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        if (user && user.role !== 'seller') {
            router.push('/dashboard'); // specific catch for wrong role?
            return;
        }
        fetchSellerData();
    }, [token, user]);

    const fetchSellerData = async () => {
        try {
            // Fetch Products
            // We likely need a backend API for "my products". 
            // Currently using /api/products but passing seller_id or creating a specific endpoint is better.
            // Let's assume GET /api/products?seller_id=ME handles it, or new endpoint.
            // For now, let's implement the backend endpoint for "my-products" or filter on client (inefficient).
            // Let's assume we create GET /api/products/my-products.
            const res = await api.get('/api/products/my-products');
            setProducts(res.data);

            // Mock Stats for now until we have orders/analytics API
            setStats({ views: 120, sales: 15, orders: 5 });
        } catch (err) {
            console.error("Error fetching seller data", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Seller Dashboard</h1>
                <Link href="/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.sales * 100}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.orders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Product Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.views}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>My Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No products found. Start selling today!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>${product.price}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>
                                            <Link href={`/products/${product.id}/edit`} className="text-blue-600 hover:underline mr-4">
                                                Edit
                                            </Link>
                                            <Link href={`/products/${product.id}`} className="text-gray-600 hover:underline">
                                                View
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
