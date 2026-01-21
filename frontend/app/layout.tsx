import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
    title: "E-Commerce Market",
    description: "A two-sided marketplace",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-gray-50 text-gray-900">
                <AuthProvider>
                    <Navbar />
                    {children}
                    <Toaster position="bottom-right" />
                </AuthProvider>
            </body>
        </html>
    );
}
