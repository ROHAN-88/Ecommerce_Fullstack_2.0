'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Toggle } from '@/components/ui/toggle'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import Image from 'next/image'

// Mock data
const mockUsers = [
  {
    id: 'user-1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    role: 'Buyer',
    status: 'Active',
    joinDate: '2023-01-15',
  },
  {
    id: 'user-2',
    name: 'Tech Store Pro',
    email: 'techstore@example.com',
    role: 'Seller',
    status: 'Active',
    joinDate: '2022-06-20',
  },
  {
    id: 'user-3',
    name: 'Priya Singh',
    email: 'priya@example.com',
    role: 'Buyer',
    status: 'Inactive',
    joinDate: '2023-03-10',
  },
  {
    id: 'user-4',
    name: 'Electronics Hub',
    email: 'electronics@example.com',
    role: 'Seller',
    status: 'Active',
    joinDate: '2022-11-05',
  },
  {
    id: 'user-5',
    name: 'Amit Patel',
    email: 'amit@example.com',
    role: 'Buyer',
    status: 'Active',
    joinDate: '2023-05-22',
  },
]

const mockAds = [
  {
    id: 'ad-1',
    title: 'Summer Sale - 50% Off',
    image: '/placeholder.svg?height=200&width=400',
    isActive: true,
    createdDate: '2024-06-01',
  },
  {
    id: 'ad-2',
    title: 'New Arrivals this Week',
    image: '/placeholder.svg?height=200&width=400',
    isActive: true,
    createdDate: '2024-06-05',
  },
  {
    id: 'ad-3',
    title: 'Flash Deal - Limited Time',
    image: '/placeholder.svg?height=200&width=400',
    isActive: false,
    createdDate: '2024-05-20',
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [adsList, setAdsList] = useState(mockAds)
  const [showAdForm, setShowAdForm] = useState(false)
  const [newAdTitle, setNewAdTitle] = useState('')

  const handleToggleAd = (id: string) => {
    setAdsList((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, isActive: !ad.isActive } : ad))
    )
  }

  const handleDeleteAd = (id: string) => {
    setAdsList((prev) => prev.filter((ad) => ad.id !== id))
  }

  const handleAddAd = () => {
    if (newAdTitle.trim()) {
      const newAd = {
        id: `ad-${Date.now()}`,
        title: newAdTitle,
        image: '/placeholder.svg?height=200&width=400',
        isActive: true,
        createdDate: new Date().toISOString().split('T')[0],
      }
      setAdsList((prev) => [newAd, ...prev])
      setNewAdTitle('')
      setShowAdForm(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="admin" />

      <div className="flex h-[calc(100vh-64px)]">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                  <p className="text-muted-foreground mt-2">Manage platform users and advertisements</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">1,284</p>
                      <p className="text-xs text-muted-foreground mt-1">+24 this week</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Buyers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">987</p>
                      <p className="text-xs text-muted-foreground mt-1">77% of users</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Sellers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">297</p>
                      <p className="text-xs text-muted-foreground mt-1">23% of users</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Active Ads</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">{adsList.filter((a) => a.isActive).length}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {adsList.length} total ads
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
                  <p className="text-muted-foreground mt-2">View and manage all platform users</p>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={user.status === 'Active' ? 'default' : 'secondary'}
                              >
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.joinDate}</TableCell>
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
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Ads Management Tab */}
            {activeTab === 'ads' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Ads Management</h1>
                    <p className="text-muted-foreground mt-2">Create and manage platform advertisements</p>
                  </div>
                  <Button className="flex items-center gap-2" onClick={() => setShowAdForm(true)}>
                    <Plus className="w-4 h-4" />
                    Create New Ad
                  </Button>
                </div>

                {/* New Ad Form */}
                {showAdForm && (
                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle>Create New Advertisement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Ad Title
                        </label>
                        <Input
                          value={newAdTitle}
                          onChange={(e) => setNewAdTitle(e.target.value)}
                          placeholder="Enter ad title..."
                          onKeyDown={(e) => e.key === 'Enter' && handleAddAd()}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Ad Image
                        </label>
                        <Input
                          type="file"
                          accept="image/*"
                          placeholder="Upload ad image..."
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleAddAd}>Create Ad</Button>
                        <Button variant="outline" onClick={() => setShowAdForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Ads Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {adsList.map((ad) => (
                    <Card key={ad.id} className="overflow-hidden">
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <Image
                          src={ad.image || "/placeholder.svg"}
                          alt={ad.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <CardContent className="p-4 space-y-4">
                        <h3 className="font-semibold text-foreground">{ad.title}</h3>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">Created: {ad.createdDate}</p>
                          <Badge variant={ad.isActive ? 'default' : 'secondary'}>
                            {ad.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Toggle
                            pressed={ad.isActive}
                            onPressedChange={() => handleToggleAd(ad.id)}
                            className="flex-1"
                          >
                            {ad.isActive ? 'Active' : 'Inactive'}
                          </Toggle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteAd(ad.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
