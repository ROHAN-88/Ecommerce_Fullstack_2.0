import Link from "next/link";
import Image from "next/image";
import SearchFilters from "@/components/SearchFilters";
import AdBanner from "@/components/AdBanner";

// Force dynamic rendering since we rely on searchParams
export const dynamic = 'force-dynamic';

async function getProducts(
    searchParamsPromise?: Promise<Record<string, string | string[] | undefined>>
) {
    const paramsObj = (await searchParamsPromise) || {};
    const cleanParams = new URLSearchParams();

    for (const key of Object.keys(paramsObj)) {
        const val = paramsObj[key];
        if (!val) continue;

        if (Array.isArray(val)) {
            val.forEach(v => v && cleanParams.append(key, v));
        } else {
            cleanParams.append(key, val);
        }
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
        const res = await fetch(`${apiUrl}/api/products?${cleanParams.toString()}`, {
            cache: 'no-store',
        });
        if (!res.ok) return [];
        return res.json();
    } catch (err) {
        console.error('Failed to fetch products', err);
        return [];
    }
}
export default async function Home(props: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const products = await getProducts(props.searchParams);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Marketplace</h1>
            <AdBanner /> {/* Added AdBanner component */}
            <SearchFilters />
            <h2 className="text-2xl font-bold mb-6">Results ({products.length})</h2>
            {products.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No products found matching your criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((item: any) => (
                        <div
                            key={item.id}
                            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
                        >
                            <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center overflow-hidden relative">
                                {item.image_url ? (
                                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                ) : (
                                    <span className="text-gray-400">No Image</span>
                                )}
                            </div>
                            <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                            <p className="text-green-600 font-bold">${item.price}</p>
                            <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                            <Link
                                href={`/products/${item.id}`}
                                className="text-blue-600 hover:underline text-sm mt-2 block"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
