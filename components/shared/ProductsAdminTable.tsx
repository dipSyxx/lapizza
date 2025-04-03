/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import { Button } from '@/components/ui'
import { ArrowUpDown, Edit, Trash2, Loader2, Pizza, Package } from 'lucide-react'
import { ProductWithCategory } from '@/hooks/useAdminProducts'
import { ProductItem } from '@prisma/client'

interface ProductsTableProps {
  products: ProductWithCategory[]
  sortField: 'name' | 'category' | 'createdAt'
  sortDirection: 'asc' | 'desc'
  onSort: (field: 'name' | 'category' | 'createdAt') => void
  onEdit: (id: number) => void
  onDelete: (product: ProductWithCategory) => void
  deletingId: number | null
}

const isPizza = (product: ProductWithCategory) => {
  return product.items?.some((item: ProductItem) => item.size !== null || item.pizzaType !== null) || false
}

export default function ProductsAdminTable({
  products,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  deletingId,
}: ProductsTableProps) {
  const getSortIconClasses = (field: 'name' | 'category' | 'createdAt') => {
    if (sortField !== field) {
      return 'opacity-0 group-hover:opacity-50 transition-transform'
    }
    return `opacity-100 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center gap-1">
                <span>Name</span>
                <ArrowUpDown size={14} className={getSortIconClasses('name')} />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
              onClick={() => onSort('category')}
            >
              <div className="flex items-center gap-1">
                <span>Category</span>
                <ArrowUpDown size={14} className={getSortIconClasses('category')} />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
              onClick={() => onSort('createdAt')}
            >
              <div className="flex items-center gap-1">
                <span>Created At</span>
                <ArrowUpDown size={14} className={getSortIconClasses('createdAt')} />
              </div>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Error'
                    }}
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {product.category.name}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {isPizza(product) ? (
                  <span className="flex items-center text-sm text-gray-500">
                    <Pizza size={16} className="mr-1 text-orange-500" />
                    Pizza
                  </span>
                ) : (
                  <span className="flex items-center text-sm text-gray-500">
                    <Package size={16} className="mr-1 text-gray-500" />
                    Regular
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(product.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary mr-2 inline-flex items-center gap-1"
                  onClick={() => onEdit(product.id)}
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive inline-flex items-center gap-1"
                  onClick={() => onDelete(product)}
                  disabled={deletingId === product.id}
                >
                  {deletingId === product.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  <span>Delete</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
