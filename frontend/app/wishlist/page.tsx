'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, ShoppingCart } from 'lucide-react';

export default function WishlistPage() {
    const { token } = useAuth();
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) fetchWishlist();
    }, [token]);

    const fetchWishlist = async () => {
        try {
            const res = await api.get('/api/wishlist');
            setWishlist(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId: number) => {
        try {
            await api.delete(`/api/wishlist/${productId}`);
            setWishlist(prev => prev.filter(item => item.id !== productId)); // item.id is product id as p.* was selected
            toast.success("Removed from wishlist");
        } catch (err) {
            console.error(err);
            toast.error("Failed to remove item");
        }
    };

    if (loading) return <div className="p-8">Loading wishlist...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Added On</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {wishlist.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        Your wishlist is empty.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                wishlist.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="w-16 h-16 relative">
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="object-cover w-full h-full rounded"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/products/${item.id}`} className="font-semibold hover:underline">
                                                {item.name}
                                            </Link>
                                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                                                {item.description}
                                            </div>
                                        </TableCell>
                                        <TableCell>${item.price}</TableCell>
                                        <TableCell>{new Date(item.added_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="space-x-2">
                                            <Button size="sm" variant="destructive" onClick={() => removeFromWishlist(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <Link href={`/products/${item.id}`}>
                                                <Button size="sm" variant="outline">
                                                    <ShoppingCart className="h-4 w-4 mr-2" /> View
                                                </Button>
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
