'use client';

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';

const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'); // Connect to backend

interface Message {
    id: string;
    content: string;
    sender_id: number;
    created_at: string;
}

interface User {
    id: number;
    name: string;
}

interface ChatWindowProps {
    chatId: string;
    initialMessages: Message[];
    otherUser: User | null;
}

export default function ChatWindow({ chatId, initialMessages, otherUser }: ChatWindowProps) {
    const { user, token } = useAuth();
    const [messages, setMessages] = useState<Message[]>(initialMessages || []);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Join chat room
        socket.emit('join_chat', chatId);

        // Listen for incoming messages
        socket.on('receive_message', (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newMessage })
            });

            if (!res.ok) throw new Error('Failed to send message');

            // Let socket update UI to avoid dups if we optimistically add too.
            setNewMessage('');
        } catch (err) {
            console.error(err);
            alert('Failed to send message');
        }
    };

    return (
        <div className="flex flex-col h-[500px] border rounded-lg bg-white shadow-sm">
            {/* Header */}
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-lg">Chat with {otherUser?.name || 'Seller'}</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-lg p-3 ${isMe ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                                }`}>
                                <p>{msg.content}</p>
                                <span className={`text-xs block mt-1 ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
