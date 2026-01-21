import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Ensure Bearer scheme
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Global Error Handling
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // Optional: Handle 401 Unauthorized globally (e.g. redirect to login)
    if (error.response && error.response.status === 401) {
        // Only redirect if not already on auth pages to avoid loops
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            // window.location.href = '/login'; 
            // Commented out to prevent aggressive redirects during dev/debugging
        }
    }
    return Promise.reject(error);
});

export default api;
