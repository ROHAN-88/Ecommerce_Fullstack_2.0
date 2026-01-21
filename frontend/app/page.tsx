'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { AdsCarousel } from '@/components/ads-carousel'
import { ProductCard } from '@/components/product-card'
import { SidebarFilters } from '@/components/sidebar-filters'
import { Pagination } from '@/components/pagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getProducts, Product } from '@/lib/api/products'

// Mock Data for Ads (can be replaced with real ads API later)
const mockAds = [
  {
    id: '1',
    image: '/placeholder.svg?height=400&width=1200',
    title: 'Summer Sale - 50% Off',
  },
  {
    id: '2',
    image: '/placeholder.svg?height=400&width=1200',
    title: 'New Arrivals this Week',
  },
  {
    id: '3',
    image: '/placeholder.svg?height=400&width=1200',
    title: 'Flash Deal - Limited Time',
  },
]

const filterOptions = {
  categories: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books'],
  locations: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad'],
}

export default function Home() {
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [savedItems, setSavedItems] = useState<string[]>([])
  const [topProductsIndex, setTopProductsIndex] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const itemsPerPage = 12

  // Fetch products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const data = await getProducts()
        setProducts(data)
      } catch (err: any) {
        console.error('Error loading products:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Filter products based on search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  // Get top products (first 4)
  const topProducts = filteredProducts.slice(0, 4)

  // Paginate products
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const handleSaveItem = (id: string) => {
    setSavedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleTopProductsPrev = () => {
    setTopProductsIndex((prev) => (prev - 1 + topProducts.length) % topProducts.length)
  }

  const handleTopProductsNext = () => {
    setTopProductsIndex((prev) => (prev + 1) % topProducts.length)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="buyer" searchValue={searchValue} onSearchChange={setSearchValue} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Ads Section */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-4">FEATURED PROMOTIONS</h2>
          <AdsCarousel ads={mockAds} />
        </section>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Top Products Section */}
        {!loading && topProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Top Products</h2>
            <div className="relative">
              <div className="flex gap-4 overflow-hidden">
                {topProducts
                  .slice(topProductsIndex, topProductsIndex + 4)
                  .map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-1/4">
                      <ProductCard
                        id={product.id.toString()}
                        name={product.name}
                        price={product.price}
                        image={product.image_url || '/placeholder.svg?height=300&width=300'}
                        location={product.location}
                        sellerName={`Seller ${product.seller_id}`}
                        isSaved={savedItems.includes(product.id.toString())}
                        onToggleSave={() => handleSaveItem(product.id.toString())}
                      />
                    </div>
                  ))}
              </div>

              {topProducts.length > 4 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -left-4 top-1/3 -translate-y-1/2 bg-background border border-border hover:bg-muted z-10"
                    onClick={handleTopProductsPrev}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-4 top-1/3 -translate-y-1/2 bg-background border border-border hover:bg-muted z-10"
                    onClick={handleTopProductsNext}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>
          </section>
        )}

        {/* Main Products Section */}
        {!loading && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-8">All Products</h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <aside className="lg:col-span-1">
                <SidebarFilters
                  options={filterOptions}
                  onFilterChange={(filters) => {
                    console.log('Filters applied:', filters)
                    // TODO: Implement filter API integration
                  }}
                />
              </aside>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id.toString()}
                      name={product.name}
                      price={product.price}
                      image={product.image_url || '/placeholder.svg?height=300&width=300'}
                      location={product.location}
                      sellerName={`Seller ${product.seller_id}`}
                      isSaved={savedItems.includes(product.id.toString())}
                      onToggleSave={() => handleSaveItem(product.id.toString())}
                    />
                  ))}
                </div>

                {paginatedProducts.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No products found</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
