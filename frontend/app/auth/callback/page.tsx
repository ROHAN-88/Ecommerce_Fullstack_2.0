'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthData } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const handleCallback = () => {
            try {
                // Extract data from URL parameters
                const token = searchParams.get('token');
                const role = searchParams.get('role');
                const name = searchParams.get('name');

                if (!token || !role || !name) {
                    setStatus('error');
                    setErrorMessage('Missing authentication data');
                    return;
                }

                // Decode token to get user ID and email
                const payload = JSON.parse(atob(token.split('.')[1]));

                const user = {
                    id: payload.id,
                    name: decodeURIComponent(name),
                    email: payload.email || '',
                    role: role as 'buyer' | 'seller' | 'admin',
                };

                // Store auth data
                setAuthData(token, user);
                setStatus('success');

                // Redirect based on role
                setTimeout(() => {
                    if (role === 'seller') {
                        router.push('/seller/dashboard');
                    } else if (role === 'admin') {
                        router.push('/admin/dashboard');
                    } else {
                        router.push('/');
                    }
                }, 1000);
            } catch (error) {
                console.error('OAuth callback error:', error);
                setStatus('error');
                setErrorMessage('Failed to process authentication');
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">
                        {status === 'processing' && 'Completing Sign In...'}
                        {status === 'success' && 'Success!'}
                        {status === 'error' && 'Authentication Failed'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    {status === 'processing' && (
                        <div className="space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="text-muted-foreground">Please wait while we sign you in...</p>
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="space-y-4">
                            <div className="text-4xl">✓</div>
                            <p className="text-muted-foreground">Redirecting to your dashboard...</p>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="space-y-4">
                            <div className="text-4xl text-destructive">✗</div>
                            <p className="text-muted-foreground">{errorMessage}</p>
                            <a href="/login" className="text-primary hover:underline">
                                Return to login
                            </a>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
