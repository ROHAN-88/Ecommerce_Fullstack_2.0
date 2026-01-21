import axios from '../axios';
import { setAuthData, User } from '../auth';

// Login with email and password
export async function login(email: string, password: string) {
    const response = await axios.post('/auth/login', { email, password });

    if (response.data.token && response.data.user) {
        setAuthData(response.data.token, response.data.user);
    }

    return response.data;
}

// Register as buyer
export async function registerBuyer(data: {
    name: string;
    email: string;
    password: string;
    role: 'buyer';
}) {
    const response = await axios.post('/auth/register', data);
    return response.data;
}

// Register as seller
export async function registerSeller(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    citizenship_id: string;
    pan_number?: string;
}) {
    const response = await axios.post('/auth/register-seller', data);

    // Auto-login for seller registration
    if (response.data.token && response.data.user) {
        setAuthData(response.data.token, response.data.user);
    }

    return response.data;
}

// Get OAuth URL for Google login
export function getGoogleOAuthUrl(role: 'buyer' | 'seller' = 'buyer'): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    return `${baseUrl}/auth/google?role=${role}`;
}

// Get OAuth URL for Facebook login
export function getFacebookOAuthUrl(role: 'buyer' | 'seller' = 'buyer'): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    return `${baseUrl}/auth/facebook?role=${role}`;
}
