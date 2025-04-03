'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Pizza,
  Salad,
  FolderTree,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Pizza size={20} /> },
    { name: 'Ingredients', path: '/admin/ingredients', icon: <Salad size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <FolderTree size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={cn(
          'bg-gray-900 text-white transition-all duration-300 ease-in-out relative',
          collapsed ? 'w-20' : 'w-64',
        )}
      >
        <div
          className={cn(
            'p-4 flex items-center border-b border-gray-800',
            collapsed ? 'justify-center' : 'justify-between',
          )}
        >
          {!collapsed && <h1 className="text-xl font-bold text-nowrap">Admin Panel</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-800 transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="mt-6">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-md transition-colors',
                    isActive(item.path) ? 'bg-primary text-white' : 'hover:bg-gray-800 text-gray-300 hover:text-white',
                    collapsed ? 'justify-center' : 'justify-start',
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
          <Link
            href="/"
            className={cn(
              'flex items-center text-gray-300 hover:text-white transition-colors',
              collapsed ? 'justify-center' : 'justify-start',
            )}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-3">Back to Site</span>}
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout
