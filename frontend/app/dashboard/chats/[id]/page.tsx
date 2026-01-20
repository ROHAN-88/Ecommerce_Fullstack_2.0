'use client';

import { useEffect, useState, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import ChatWindow from '@/components/ChatWindow';

export default function SingleChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user, token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [otherUser, setOtherUser] = useState(null);

    useEffect(() => {
        if (!token) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/chats/${id}/messages`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [id, token]);

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
