'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Ad {
    id: number;
    title: string;
    image_url: string;
    link_url?: string;
}

export default function AdBanner() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ads/active`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setAds(data);
            })
            .catch(console.error);
    }, []);

    // Rotation logic
    useEffect(() => {
        if (ads.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [ads]);

    if (ads.length === 0) return null;

    const currentAd = ads[currentIndex];

    return (
        <div className="w-full mb-8 relative rounded-xl overflow-hidden shadow-lg h-48 md:h-72 bg-gray-100">
            {currentAd.link_url ? (
                <a href={currentAd.link_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
                    <Image
                        src={currentAd.image_url}
                        alt={currentAd.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white px-4 py-2 text-sm rounded-tr-lg">
                        Sponsored
                    </div>
                </a>
            ) : (
                <div className="w-full h-full relative">
                    <Image
                        src={currentAd.image_url}
                        alt={currentAd.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white px-4 py-2 text-sm rounded-tr-lg">
                        Sponsored
                    </div>
                </div>
            )}

            {/* Dots */}
            {ads.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {ads.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
