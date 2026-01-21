// Auth helper functions for managing authentication state

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'buyer' | 'seller' | 'admin';
}

// Get current user from localStorage
export function getUser(): User | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

// Get user role
export function getUserRole(): string | null {
    const user = getUser();
    return user?.role || null;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
}

// Set authentication data
export function setAuthData(token: string, user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    // Set cookie for middleware
    document.cookie = `token=${token}; path=/; max-age=86400`; // 1 day
}

// Clear authentication data
export function logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
}

// Get token
export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}
