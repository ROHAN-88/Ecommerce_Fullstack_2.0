'use client';

import { useEffect, useState, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import ChatWindow from '@/components/ChatWindow';

export default function SingleChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user, token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [otherUser, setOtherUser] = useState<{ name: string, id: number } | null>(null);

    useEffect(() => {
        if (!token) return;

        const fetchChatData = async () => {
            try {
                // Fetch messages
                const msgRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${id}/messages`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (msgRes.ok) {
                    const data = await msgRes.json();
                    setMessages(data);
                }

                // Fetch chat details
                const chatRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (chatRes.ok) {
                    const chatData = await chatRes.json();
                    if (user) {
                        const isBuyer = user.id === chatData.buyer_id;
                        setOtherUser({
                            name: isBuyer ? chatData.seller_name : chatData.buyer_name,
                            id: isBuyer ? chatData.seller_id : chatData.buyer_id
                        });
                    }
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchChatData();
    }, [id, token, user]);

    if (loading) return <div className="p-8">Loading chat...</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <ChatWindow
                chatId={id}
                initialMessages={messages}
                otherUser={otherUser} // Need to fetch details separate or pass via context/location state (complex). 
            // For MVP, ChatWindow header might just say "Chat".
            />
        </div>
    );
}
