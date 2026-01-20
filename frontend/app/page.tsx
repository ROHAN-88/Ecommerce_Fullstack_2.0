import Link from "next/link";

export default function Home() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Top Products</h2>
                <div className="bg-gray-100 p-10 text-center rounded-lg">
                    <p className="text-xl text-gray-500">Carousel Placeholder</p>
                </div>
            </section>

            <section>
                <h2 className="text-3xl font-bold mb-6">Explore Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Mock Product Grid */}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div key={item} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                            <div className="h-40 bg-gray-200 rounded mb-4"></div>
                            <h3 className="font-semibold text-lg">Product {item}</h3>
                            <p className="text-gray-600">$99.99</p>
                            <Link href={`/products/${item}`} className="text-blue-600 hover:underline text-sm mt-2 block">
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
