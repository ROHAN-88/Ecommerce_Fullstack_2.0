"use client";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const role = searchParams.get('role');
        const name = searchParams.get('name'); // Optional for immediate UI feedback

        if (token && role) {
            // Reconstruct minimal user object or fetch full profile if needed
            // For MVP we just use what back passed back
            const user = {
                id: 0, // We didn't pass ID back in query param for brevity, but token has it. Context decodes or we fetch /me.
                // In a real app, use token to fetch /api/auth/me to get full user details cleanly.
                // For MVP, lets assume decoding or just minimal info.
                name: name || 'User',
                email: '', // Not passed in URL for privacy
                role: role as 'buyer' | 'seller' | 'admin'
            };

            // We can decode token here or just trust content
            login(token, user);

            // Redirect
            if (role === 'seller') {
                router.push('/seller/dashboard');
            } else if (role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        } else {
            // valid error handling
            router.push('/login?error=oauth_failed');
        }
    }, [searchParams, login, router]);

    return (
        <div className="flex bg-gray-50 items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Authenticating...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
        </div>
    );
}
