'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminDashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        fetchDashboardData();
    }, [token]);

    const fetchDashboardData = async () => {
        try {
            const [analyticsRes, usersRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (analyticsRes.ok) setStats(await analyticsRes.json());
            if (usersRes.ok) setUsers(await usersRes.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUserStatusChange = async (userId: number, newStatus: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) fetchDashboardData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Stats Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-700">Total Users</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.users?.total || 0}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
                    <h3 className="text-lg font-semibold text-green-700">Products</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.products || 0}</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100">
                    <h3 className="text-lg font-semibold text-purple-700">Ad Campaigns</h3>
                    <Link href="/admin/ads" className="text-sm text-purple-600 hover:underline mt-2 block">
                        Manage Ads &rarr;
                    </Link>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-bold">User Management</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                        <div className="text-sm text-gray-500">{u.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{u.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${u.status === 'active' ? 'bg-green-100 text-green-800' :
                                                u.status === 'banned' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {u.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {u.status !== 'banned' && (
                                            <button
                                                onClick={() => handleUserStatusChange(u.id, 'banned')}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Ban
                                            </button>
                                        )}
                                        {u.status === 'banned' && (
                                            <button
                                                onClick={() => handleUserStatusChange(u.id, 'active')}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                Unban
                                            </button>
                                        )}
                                        {u.status !== 'suspended' && u.status !== 'banned' && (
                                            <button
                                                onClick={() => handleUserStatusChange(u.id, 'suspended')}
                                                className="text-yellow-600 hover:text-yellow-900"
                                            >
                                                Suspend
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
