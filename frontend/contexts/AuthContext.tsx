'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser, isAuthenticated, logout as authLogout, User } from '@/lib/auth';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => void;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on mount
        const loadUser = () => {
            try {
                const currentUser = getUser();
                // Fix: If no user in localStorage but cookie exists, clear cookie to prevent middleware loops
                if (!currentUser && typeof document !== 'undefined' && document.cookie.includes('token=')) {
                    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
                }
                setUser(currentUser);
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const logout = () => {
        authLogout();
        setUser(null);
        window.location.href = '/login';
    };

    const value = {
        user,
        isLoading,
        isAuthenticated: isAuthenticated(),
        logout,
        setUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
