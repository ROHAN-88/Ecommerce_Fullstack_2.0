export default function SellerDashboard() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
            <p>Welcome back, Seller!</p>
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">My Products</h2>
                {/* Placeholder for Product CRUD */}
                <p className="text-gray-500">No products yet.</p>
                <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Add New Product
                </button>
            </div>
        </div>
    );
}
