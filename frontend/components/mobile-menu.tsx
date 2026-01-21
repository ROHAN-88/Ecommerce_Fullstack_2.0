'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'

interface MobileMenuProps {
  userRole?: 'buyer' | 'seller' | 'admin' | null
}

export function MobileMenu({ userRole }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <nav className="space-y-4 mt-8">
          {!userRole ? (
            <>
              <SheetClose asChild>
                <Link href="/login">
                  <Button variant="outline" className="w-full bg-transparent">
                    Login
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/register">
                  <Button className="w-full">Register</Button>
                </Link>
              </SheetClose>
            </>
          ) : (
            <>
              {userRole === 'buyer' && (
                <>
                  <SheetClose asChild>
                    <Link href="/">
                      <Button variant="ghost" className="w-full justify-start">
                        Home
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/dashboard">
                      <Button variant="ghost" className="w-full justify-start">
                        Dashboard
                      </Button>
                    </Link>
                  </SheetClose>
                </>
              )}

              {userRole === 'seller' && (
                <SheetClose asChild>
                  <Link href="/seller/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      My Shop
                    </Button>
                  </Link>
                </SheetClose>
              )}

              {userRole === 'admin' && (
                <SheetClose asChild>
                  <Link href="/admin/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      Admin Dashboard
                    </Button>
                  </Link>
                </SheetClose>
              )}

              <hr className="my-2" />

              <SheetClose asChild>
                <Button variant="outline" className="w-full bg-transparent">
                  Logout
                </Button>
              </SheetClose>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
