'use client'

import Link from 'next/link'
import { Search, User, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MobileMenu } from './mobile-menu'
import { useAuth } from '@/contexts/AuthContext'

interface NavbarProps {
  userRole?: 'buyer' | 'seller' | 'admin' | null
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearch?: () => void
}

export function Navbar({ searchValue = '', onSearchChange, onSearch }: NavbarProps) {
  const { user, logout } = useAuth()
  const userRole = user?.role || null

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">MarketHub</span>
          </Link>

          {/* Search Bar - Only on Homepage or for Buyers */}
          {(!userRole || userRole === 'buyer') && (
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          )}

          {/* Right Side Menu */}
          <div className="flex items-center gap-4">
            {userRole === 'buyer' && (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            )}

            {userRole === 'seller' && (
              <Link href="/seller/dashboard">
                <Button variant="ghost" size="sm">
                  My Shop
                </Button>
              </Link>
            )}

            {userRole === 'admin' && (
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  Admin
                </Button>
              </Link>
            )}

            {!userRole && (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* User Menu - Only show when logged in */}
            {userRole && (
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {userRole === 'buyer' && (
                      <DropdownMenuItem asChild>
                        <Link href="/profile">My Profile</Link>
                      </DropdownMenuItem>
                    )}
                    {userRole === 'seller' && (
                      <DropdownMenuItem asChild>
                        <Link href="/seller/profile">Shop Profile</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile Menu */}
            <MobileMenu userRole={userRole} />
          </div>
        </div>
      </div>
    </nav>
  )
}
