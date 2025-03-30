import React from 'react'
import { prisma } from '@/prisma/prisma-client'
import { ShoppingBag, Layers, Salad, FileText, Users, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const [productsCount, categoriesCount, ingredientsCount, ordersCount, usersCount, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.ingredient.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        fullName: true,
      },
    }),
  ])

  return {
    productsCount,
    categoriesCount,
    ingredientsCount,
    ordersCount,
    usersCount,
    recentOrders,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Products"
          value={stats.productsCount}
          icon={<ShoppingBag className="text-blue-500" />}
          description="Total products"
          trend="up"
        />
        <StatCard
          title="Categories"
          value={stats.categoriesCount}
          icon={<Layers className="text-indigo-500" />}
          description="Product categories"
        />
        <StatCard
          title="Ingredients"
          value={stats.ingredientsCount}
          icon={<Salad className="text-green-500" />}
          description="Available ingredients"
        />
        <StatCard
          title="Orders"
          value={stats.ordersCount}
          icon={<FileText className="text-yellow-500" />}
          description="Total orders"
          trend="up"
        />
        <StatCard
          title="Users"
          value={stats.usersCount}
          icon={<Users className="text-purple-500" />}
          description="Registered users"
          trend="up"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          <p className="text-sm text-gray-500 mt-1">Latest 5 orders from customers</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      $ {order.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1 text-gray-400" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <AlertCircle size={24} className="text-gray-400 mb-2" />
                      <p>No orders found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">
            View all orders →
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  description,
  trend,
}: {
  title: string
  value: number
  icon: React.ReactNode
  description: string
  trend?: 'up' | 'down'
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-2 rounded-md bg-gray-50">{icon}</div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">{description}</p>
        {trend && (
          <div className={`flex items-center text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? (
              <TrendingUp size={14} className="mr-1" />
            ) : (
              <TrendingUp size={14} className="mr-1 transform rotate-180" />
            )}
            <span>{trend === 'up' ? '+10%' : '-5%'}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  let bgColor = ''
  let textColor = ''
  let icon = null

  switch (status) {
    case 'SUCCEEDED':
      bgColor = 'bg-green-100'
      textColor = 'text-green-800'
      icon = <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
      break
    case 'PENDING':
      bgColor = 'bg-yellow-100'
      textColor = 'text-yellow-800'
      icon = <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
      break
    case 'CANCELLED':
      bgColor = 'bg-red-100'
      textColor = 'text-red-800'
      icon = <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
      break
    default:
      bgColor = 'bg-gray-100'
      textColor = 'text-gray-800'
      icon = <div className="w-2 h-2 rounded-full bg-gray-500 mr-1"></div>
  }

  return (
    <span className={`px-3 py-1 inline-flex items-center text-xs font-medium rounded-full ${bgColor} ${textColor}`}>
      {icon}
      {status}
    </span>
  )
}
