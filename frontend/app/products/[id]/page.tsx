"use client";
import { use, useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    // Mock data fetching
    const product = {
        id,
        name: `Product ${id}`,
        price: 99.99,
        description: "This is a great product.",
        seller: {
            name: "John's Shop",
            phone: "+1 234 567 890",
            location: "New York, USA"
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <Link href="/" className="text-blue-600 mb-4 inline-block">&larr; Back to Home</Link>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>

                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-2xl font-semibold text-green-600 mb-4">${product.price}</p>

                <p className="text-gray-700 mb-6">{product.description}</p>

                <div className="border-t pt-6">
                    <h2 className="text-xl font-bold mb-4">Seller Information</h2>
                    <p><strong>Shop:</strong> {product.seller.name}</p>
                    <p><strong>Location:</strong> {product.seller.location}</p>
                    <p><strong>Phone:</strong> {product.seller.phone}</p>

                    <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
                        Start Chat
                    </button>
                </div>
            </div>
        </div>
    );
}
