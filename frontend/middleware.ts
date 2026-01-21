import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const userCookie = request.cookies.get('user')?.value;
    const { pathname } = request.nextUrl;

    // Define protected routes pattern
    const isProtected = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/wishlist');

    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

    // 1. Redirect if not authenticated on protected routes
    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Redirect if authenticated on auth routes (already logged in)
    if (isAuthRoute && token) {
        // Decide where to go based on role
        if (userCookie) {
            try {
                const user = JSON.parse(userCookie);
                if (user.role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
                if (user.role === 'seller') return NextResponse.redirect(new URL('/seller/dashboard', request.url));
                return NextResponse.redirect(new URL('/', request.url));
            } catch (e) {
                // Invalid cookie, ignore
            }
        }
    }

    // 3. Role-based protection
    if (token && userCookie) {
        try {
            const user = JSON.parse(userCookie);

            // Admin Protection
            if (pathname.startsWith('/admin') && user.role !== 'admin') {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }

            // Seller Protection
            if ((pathname.startsWith('/seller') || pathname.startsWith('/dashboard/seller')) && user.role !== 'seller') {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }

        } catch (e) {
            // Error parsing cookie
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/seller/:path*', '/wishlist/:path*', '/login', '/register/:path*'],
};
