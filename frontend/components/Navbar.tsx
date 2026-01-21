"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <nav className="border-b bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="text-2xl font-bold text-gray-900">
                        Marketplace
                    </Link>

                    <div className="flex gap-4 items-center">
                        {/* Common Links */}
                        <Link href="/" className={`text-gray-700 hover:text-gray-900 ${pathname === '/' ? 'font-semibold' : ''}`}>
                            Home
                        </Link>

                        {/* Guest Links */}
                        {!user && (
                            <>
                                <Link href="/login" className="text-gray-700 hover:text-gray-900">
                                    Login
                                </Link>
                                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                                    Register
                                </Link>
                            </>
                        )}

                        {/* Buyer/Seller/Admin Links based on role */}
                        {/* Buyer/Seller/Admin Links based on role */}
                        {/* Buyer/Seller/Admin Links based on role */}
                        {user && (
                            <Link href="/wishlist" className="text-gray-700 hover:text-black">Wishlist</Link>
                        )}

                        {user?.role === 'seller' && (
                            <Link href="/seller/dashboard" className="text-gray-700 hover:text-black">Seller Dashboard</Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link href="/admin/dashboard" className="text-gray-700 hover:text-black">Admin Dashboard</Link>
                        )}

                        {user && (
                            <button onClick={logout} className="text-red-500 hover:text-red-700">Logout</button>
                        )}

                        {user && (
                            <span className="text-sm text-gray-500 border-l pl-4 ml-2">Hello, {user.name}</span>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
