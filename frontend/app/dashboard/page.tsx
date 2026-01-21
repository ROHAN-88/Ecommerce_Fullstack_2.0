'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChatList } from '@/components/chat-list'
import { ChatInterface } from '@/components/chat-interface'
import { ProductCard } from '@/components/product-card'
import { MessageSquare, Heart, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// Mock data
const mockConversations = [
  {
    id: 'conv-1',
    participantName: 'Tech Store Pro',
    lastMessage: 'Sure! Let me check the stock for you.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: 'conv-2',
    participantName: 'Electronics Hub',
    lastMessage: 'The delivery will be done by tomorrow.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isRead: false,
  },
  {
    id: 'conv-3',
    participantName: 'Power Solutions',
    lastMessage: 'Thank you for your purchase!',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isRead: true,
  },
]

const mockChatMessages = [
  {
    id: 'msg-1',
    sender: 'seller' as const,
    senderName: 'Tech Store Pro',
    content: 'Hi! How can I help you?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'msg-2',
    sender: 'buyer' as const,
    senderName: 'You',
    content: 'Do you have this headphone in black color?',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    id: 'msg-3',
    sender: 'seller' as const,
    senderName: 'Tech Store Pro',
    content: 'Sure! Let me check the stock for you.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
]

const mockSavedItems = [
  {
    id: 'saved-1',
    image: '/placeholder.svg?height=300&width=300',
    name: 'Sony WH-1000XM4 Headphones',
    price: 24999,
    location: 'Mumbai',
    sellerName: 'Tech Store Pro',
  },
  {
    id: 'saved-2',
    image: '/placeholder.svg?height=300&width=300',
    name: 'Apple AirPods Pro',
    price: 26900,
    location: 'Delhi',
    sellerName: 'Electronics Hub',
  },
  {
    id: 'saved-3',
    image: '/placeholder.svg?height=300&width=300',
    name: 'Samsung Galaxy Buds',
    price: 12999,
    location: 'Bangalore',
    sellerName: 'Mobile Zone',
  },
]

export default function BuyerDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]?.id)
  const [activeTab, setActiveTab] = useState('messages')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
    if (!isLoading && user && user.role !== 'buyer') {
      // Optional: Redirect sellers to seller dashboard if they try to access buyer dashboard?
      // For now, allowing access or just redirecting home might be better.
      // router.push('/')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  const selectedChat = mockConversations.find((c) => c.id === selectedConversation)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your messages and saved items</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Saved Items
            </TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
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
                      <p className="text-xs text-muted-foreground">Active now</p>
                    </div>
                    <ChatInterface
                      messages={mockChatMessages}
                      currentUserRole="buyer"
                      onSendMessage={(msg) => console.log('Message sent:', msg)}
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Saved Items Tab */}
          <TabsContent value="saved" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-6">Saved Items ({mockSavedItems.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockSavedItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    {...item}
                    isSaved={true}
                    onToggleSave={() => console.log('Item removed from saved')}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
