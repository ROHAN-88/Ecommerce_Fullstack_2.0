'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ChatListPage() {
    const { user, token } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const fetchChats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setChats(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [token]);

    if (!user) return <div className="p-8">Please login to view chats.</div>;
    if (loading) return <div className="p-8">Loading chats...</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">My Messages</h1>

            {chats.length === 0 ? (
                <p className="text-gray-500">No conversations yet.</p>
            ) : (
                <div className="space-y-4">
                    {chats.map((chat) => {
                        const isBuyer = user.id === chat.buyer_id;
                        const otherName = isBuyer ? chat.seller_name : chat.buyer_name;
                        const productName = chat.product_name || 'Unknown Product';

                        return (
                            <Link
                                key={chat.id}
                                href={`/dashboard/chats/${chat.id}`}
                                className="block p-4 border rounded-lg hover:bg-gray-50 transition shadow-sm"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">{otherName}</h3>
                                        <p className="text-sm text-gray-600">Re: {productName}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(chat.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
