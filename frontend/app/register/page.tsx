'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShoppingBag } from 'lucide-react'
import { registerBuyer, registerSeller, getGoogleOAuthUrl, getFacebookOAuthUrl } from '@/lib/api/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [userType, setUserType] = useState('buyer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Buyer form state
  const [buyerData, setBuyerData] = useState({
    name: '',
    email: '',
    password: '',
  })

  // Seller form state (simplified)
  const [sellerData, setSellerData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await registerBuyer({ ...buyerData, role: 'buyer' })
      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSellerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await registerSeller({
        ...sellerData,
        phone: '',
        citizenship_id: '',
        pan_number: ''
      })
      router.push('/seller/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = (type: 'buyer' | 'seller') => {
    window.location.href = getGoogleOAuthUrl(type)
  }

  const handleFacebookLogin = (type: 'buyer' | 'seller') => {
    window.location.href = getFacebookOAuthUrl(type)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={null} />

      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Join MarketHub today
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={userType} onValueChange={setUserType}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buyer">Buyer</TabsTrigger>
                <TabsTrigger value="seller">Seller</TabsTrigger>
              </TabsList>

              {/* Buyer Registration */}
              <TabsContent value="buyer" className="space-y-4 mt-6">
                <form onSubmit={handleBuyerSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <Input
                      placeholder="John Doe"
                      value={buyerData.name}
                      onChange={(e) => setBuyerData({ ...buyerData, name: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={buyerData.email}
                      onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className=" block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={buyerData.password}
                      onChange={(e) => setBuyerData({ ...buyerData, password: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" required />
                    <span>I agree to the Terms and Conditions</span>
                  </label>

                  <Button className="w-full" size="lg" type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Buyer Account'}
                  </Button>
                </form>

                {/* OAuth Buttons */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleGoogleLogin('buyer')}
                    type="button"
                  >
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleFacebookLogin('buyer')}
                    type="button"
                  >
                    Facebook
                  </Button>
                </div>
              </TabsContent>

              {/* Seller Registration */}
              <TabsContent value="seller" className="space-y-4 mt-6">
                <form onSubmit={handleSellerSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Shop Name
                    </label>
                    <Input
                      placeholder="My Store"
                      value={sellerData.name}
                      onChange={(e) => setSellerData({ ...sellerData, name: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="shop@example.com"
                      value={sellerData.email}
                      onChange={(e) => setSellerData({ ...sellerData, email: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={sellerData.password}
                      onChange={(e) => setSellerData({ ...sellerData, password: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-xs text-blue-800">
                      Complete seller verification after registration
                    </p>
                  </div>

                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" required />
                    <span>I agree to the Seller Terms</span>
                  </label>

                  <Button className="w-full" size="lg" type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Seller Account'}
                  </Button>
                </form>

                {/* OAuth for Sellers */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleGoogleLogin('seller')}
                    type="button"
                  >
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleFacebookLogin('seller')}
                    type="button"
                  >
                    Facebook
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  Already a member?
                </span>
              </div>
            </div>

            <Link href="/login">
              <Button variant="outline" className="w-full bg-transparent">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
