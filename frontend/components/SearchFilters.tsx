'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');

    // Update local state when URL params change (e.g. back button)
    useEffect(() => {
        setSearch(searchParams.get('search') || '');
        setCategory(searchParams.get('category') || '');
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
        setSortBy(searchParams.get('sortBy') || 'createdAt');
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sortBy) params.set('sortBy', sortBy);

        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="md:col-span-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 border rounded px-3 py-2"
                        />
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                            Search
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                    <option value="Books">Books</option>
                </select>

                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        placeholder="Min $"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max $"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="createdAt">Newest</option>
                    <option value="price">Price</option>
                    <option value="name">Name</option>
                </select>

                <button
                    type="button"
                    onClick={applyFilters}
                    className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                >
                    Apply Filters
                </button>
            </form>
        </div>
    );
}
