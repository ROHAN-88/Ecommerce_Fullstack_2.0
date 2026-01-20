import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";

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
            <body>
                <AuthProvider>
                    <Navbar />
                    <main className="min-h-screen p-4">
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}
