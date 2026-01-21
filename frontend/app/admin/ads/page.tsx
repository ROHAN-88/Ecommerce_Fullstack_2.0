'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Ad {
    id: number;
    title: string;
    image_url: string;
    link_url?: string;
    priority: number;
    active: boolean;
    created_at: string;
}

export default function AdminAdsPage() {
    const { token } = useAuth();
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [newAd, setNewAd] = useState({ title: '', image_url: '', link_url: '', priority: 0 });

    useEffect(() => {
        if (token) fetchAds();
    }, [token]);

    const fetchAds = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ads/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAds(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newAd)
            });
            if (res.ok) {
                setNewAd({ title: '', image_url: '', link_url: '', priority: 0 });
                fetchAds();
            } else {
                alert('Failed to create ad');
            }
        } catch (err) {
            console.error(err);
            alert('Error creating ad');
        }
    };

    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ads/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ active: !currentStatus })
            });
            if (res.ok) fetchAds();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ads/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) fetchAds();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Advertisements</h1>
                <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
                    &larr; Back to Dashboard
                </Link>
            </div>

            {/* Create Form */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-bold mb-4">Create New Ad</h2>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Title (internal use)"
                        value={newAd.title}
                        onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                        required
                        className="border p-2 rounded"
                    />
                    <input
                        type="url"
                        placeholder="Image URL"
                        value={newAd.image_url}
                        onChange={(e) => setNewAd({ ...newAd, image_url: e.target.value })}
                        required
                        className="border p-2 rounded"
                    />
                    <input
                        type="url"
                        placeholder="Link URL (optional)"
                        value={newAd.link_url}
                        onChange={(e) => setNewAd({ ...newAd, link_url: e.target.value })}
                        className="border p-2 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Priority (Higher = First)"
                        value={newAd.priority}
                        onChange={(e) => setNewAd({ ...newAd, priority: parseInt(e.target.value) })}
                        className="border p-2 rounded"
                    />
                    <button type="submit" className="md:col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700">
                        Create Ad
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {ads.map((ad) => (
                            <tr key={ad.id}>
                                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4">
                                    <img src={ad.image_url} alt={ad.title} className="w-16 h-10 object-cover rounded" />
                                    <div>
                                        <div className="font-bold">{ad.title}</div>
                                        <a href={ad.link_url} target="_blank" className="text-sm text-blue-500 truncate max-w-xs block">{ad.link_url}</a>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {ad.priority}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ad.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {ad.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleToggleStatus(ad.id, ad.active)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        {ad.active ? 'Disable' : 'Enable'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ad.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
