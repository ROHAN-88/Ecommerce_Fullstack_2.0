'use client'

import { Users, Megaphone, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'ads', label: 'Ads Management', icon: Megaphone },
  ]

  return (
    <div className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border px-4 py-6 space-y-2">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-sidebar-foreground">Admin Panel</h2>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start text-sidebar-foreground',
                activeTab === item.id && 'bg-sidebar-primary text-sidebar-primary-foreground'
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex gap-2 pt-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-4 h-4" />
            </Button>
          )
        })}
      </div>
    </div>
  )
}
