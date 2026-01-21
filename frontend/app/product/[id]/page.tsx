'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, MessageSquare, Phone, MapPin, Star } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { getProduct, Product } from '@/lib/api/products'
import { ChatInterface } from '@/components/chat-interface'

import { useParams } from 'next/navigation'

export default function ProductDetails() {
  const params = useParams()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      // Handle array or string param (Next.js types)
      const id = Array.isArray(params.id) ? params.id[0] : params.id

      if (!id) {
        setError('Invalid product ID')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await getProduct(id)
        setProduct(data)
      } catch (err: any) {
        console.error('Error loading product:', err)
        setError('Failed to load product details')
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [params.id])

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="buyer" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Button>
        </Link>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Product Content */}
        {!loading && product && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Image */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border">
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Image Gallery Placeholder */}
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-md overflow-hidden bg-muted border border-border cursor-pointer hover:border-primary"
                    >
                      <Image
                        src={'/placeholder.svg?height=100&width=100'}
                        alt={`View ${i}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Product Info */}
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>

                {/* Rating (placeholder - not in API yet) */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.5</span>
                    <span className="text-muted-foreground">(128 reviews)</span>
                  </div>
                </div>

                {/* Price */}
                <div className="py-4 border-y border-border">
                  <p className="text-4xl font-bold text-primary">₹{product.price.toLocaleString()}</p>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description || 'No description available.'}
                  </p>
                </div>

                {/* Category */}
                {product.category && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Category</h3>
                    <span className="inline-block px-3 py-1 bg-muted rounded-md text-sm">
                      {product.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Seller Information Card */}
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Seller Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">Seller #{product.seller_id}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">4.7</span>
                      <span className="text-sm text-muted-foreground">
                        (512 reviews)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    {/* Location - Display from product */}
                    {product.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="font-semibold text-foreground">{product.location}</p>
                        </div>
                      </div>
                    )}

                    {/* Placeholder for phone */}
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-semibold text-foreground">Contact seller for details</p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground pt-2">
                      Seller since 2022
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setIsChatOpen(true)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      size="lg"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md h-[500px] flex flex-col">
            <CardHeader className="py-3 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Chat with Seller</CardTitle>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </CardHeader>
            <div className="flex-1 overflow-hidden">
              <ChatInterface
                messages={[
                  {
                    id: '1',
                    sender: 'seller',
                    senderName: `Seller #${product?.seller_id || '1'}`,
                    content: 'Hi! How can I help you regarding this product?',
                    timestamp: new Date()
                  }
                ]}
                currentUserRole="buyer"
                onSendMessage={(msg) => console.log('Sending message:', msg)}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
