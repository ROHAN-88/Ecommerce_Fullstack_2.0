'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { SellerSidebar } from '@/components/seller-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChatList } from '@/components/chat-list'
import { ChatInterface } from '@/components/chat-interface'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Edit2, Trash2, Plus, MessageSquare, Phone, MapPin } from 'lucide-react'
import { getSellerProducts, Product } from '@/lib/api/products'
import { AddProductDialog } from '@/components/add-product-dialog'

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 4500,
    stock: 15,
    status: 'Active',
    sales: 28,
  },
  {
    id: '2',
    name: 'USB Type-C Cable (Pack of 3)',
    price: 499,
    stock: 50,
    status: 'Active',
    sales: 142,
  },
  {
    id: '3',
    name: 'Phone Case - Black',
    price: 299,
    stock: 0,
    status: 'Out of Stock',
    sales: 89,
  },
  {
    id: '4',
    name: 'Screen Protector (Pack of 2)',
    price: 199,
    stock: 35,
    status: 'Active',
    sales: 76,
  },
]

const mockConversations = [
  {
    id: 'conv-1',
    participantName: 'Rajesh Kumar',
    lastMessage: 'Do you have this in stock?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
  },
  {
    id: 'conv-2',
    participantName: 'Priya Singh',
    lastMessage: 'Thank you for the quick delivery!',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: 'conv-3',
    participantName: 'Amit Patel',
    lastMessage: 'Can you deliver by tomorrow?',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isRead: true,
  },
]

const mockChatMessages = [
  {
    id: 'msg-1',
    sender: 'buyer' as const,
    senderName: 'Rajesh Kumar',
    content: 'Hi! Do you have this in stock?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'msg-2',
    sender: 'seller' as const,
    senderName: 'You',
    content: 'Yes, we have 15 units available.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    id: 'msg-3',
    sender: 'buyer' as const,
    senderName: 'Rajesh Kumar',
    content: 'Great! I would like to place an order.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
]

const sellerInfo = {
  shopName: 'Tech Store Pro',
  phone: '+91 98765 43210',
  location: 'Mumbai, Maharashtra',
}

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function SellerDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]?.id)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const selectedChat = mockConversations.find((c) => c.id === selectedConversation)

  // Auth check
  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== 'seller') {
        router.push('/login')
      }
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== 'seller') return null

  // Fetch seller products
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await getSellerProducts()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex h-[calc(100vh-64px)]">
        <SellerSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
                  <p className="text-muted-foreground mt-2">Welcome to your seller dashboard</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">₹95,232</p>
                      <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">335</p>
                      <p className="text-xs text-muted-foreground mt-1">+18 this week</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Active Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">3</p>
                      <p className="text-xs text-muted-foreground mt-1">1 out of stock</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">4.7</p>
                      <p className="text-xs text-muted-foreground mt-1">512 reviews</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">My Products</h1>
                    <p className="text-muted-foreground mt-2">Manage your product listings</p>
                  </div>
                  <AddProductDialog onProductAdded={loadProducts} />
                </div>

                <Card>
                  <CardContent className="p-0">
                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    ) : products.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No products yet. Create your first product!</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>₹{product.price.toLocaleString()}</TableCell>
                              <TableCell>{product.category || 'N/A'}</TableCell>
                              <TableCell>{product.location || 'N/A'}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Messages</h1>
                  <p className="text-muted-foreground mt-2">Chat with your customers</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                  {/* Conversations List */}
                  <div className="lg:col-span-1 border border-border rounded-lg p-4 overflow-hidden flex flex-col">
                    <h3 className="font-semibold text-foreground mb-4">Conversations</h3>
                    <div className="flex-1 overflow-y-auto">
                      <ChatList
                        conversations={mockConversations}
                        selectedId={selectedConversation}
                        onSelectConversation={setSelectedConversation}
                      />
                    </div>
                  </div>

                  {/* Chat Interface */}
                  <div className="lg:col-span-2">
                    {selectedChat && (
                      <div className="h-full flex flex-col">
                        <div className="pb-4 border-b border-border">
                          <h3 className="font-semibold text-foreground text-lg">{selectedChat.participantName}</h3>
                          <p className="text-xs text-muted-foreground">Customer</p>
                        </div>
                        <ChatInterface
                          messages={mockChatMessages}
                          currentUserRole="seller"
                          onSendMessage={(msg) => console.log('Message sent:', msg)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Shop Profile</h1>
                  <p className="text-muted-foreground mt-2">Manage your shop information</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Shop Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Shop Name</label>
                      <input
                        type="text"
                        defaultValue={sellerInfo.shopName}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        defaultValue={sellerInfo.phone}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </label>
                      <input
                        type="text"
                        defaultValue={sellerInfo.location}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="pt-4">
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
