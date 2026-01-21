import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const path = request.nextUrl.pathname;

    // Only handle authenticated user redirects away from login/register
    if (token && (path === '/login' || path === '/register')) {
        try {
            // Decode JWT to get user role
            const payload = JSON.parse(
                Buffer.from(token.split('.')[1], 'base64').toString()
            );
            const userRole = payload.role;

            // Redirect authenticated users to their dashboard
            if (userRole === 'seller') {
                return NextResponse.redirect(new URL('/seller/dashboard', request.url));
            } else if (userRole === 'admin') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            } else {
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (error) {
            // Invalid token - clear it and continue
            console.error('Invalid token:', error);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/login',
        '/register',
    ],
};
