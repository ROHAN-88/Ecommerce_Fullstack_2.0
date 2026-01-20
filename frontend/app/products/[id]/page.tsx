"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProductDetail({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();

    const { user, token } = useAuth();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data?.name) {
                    setProduct(data);
                } else {
                    setProduct({
                        id,
                        name: `Product ${id}`,
                        price: 99.99,
                        description: "This is a great product.",
                        seller_id: 1,
                        seller: {
                            name: "John's Shop"
                        }
                    });
                }
            })
            .catch(console.error);
    }, [id]);

    const handleStartChat = async () => {
        if (!user) {
            alert("Please login to start a chat");
            return;
        }
        if (!product) return;

        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/chats/initiate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        sellerId: product.seller_id,
                        productId: product.id
                    })
                }
            );

            if (!res.ok) throw new Error("Chat creation failed");

            const chat = await res.json();
            router.push(`/dashboard/chats/${chat.id}`);
        } catch (err) {
            console.error(err);
            alert("Failed to start chat");
        } finally {
            setLoading(false);
        }
    };

    if (!product) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <Link href="/" className="text-blue-600 mb-4 inline-block">
                &larr; Back to Home
            </Link>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>

                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-2xl font-semibold text-green-600 mb-4">
                    ${product.price}
                </p>

                <p className="text-gray-700 mb-6">{product.description}</p>

                <div className="border-t pt-6">
                    <h2 className="text-xl font-bold mb-4">Seller Information</h2>
                    <p>
                        <strong>Shop:</strong>{" "}
                        {product.seller?.name || `Seller #${product.seller_id}`}
                    </p>

                    <button
                        onClick={handleStartChat}
                        disabled={loading}
                        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Starting..." : "Start Chat"}
                    </button>
                </div>
            </div>
        </div>
    );
}
