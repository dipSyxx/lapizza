/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import { Ingredient } from '@prisma/client'
import { Button } from '@/components/ui'
import { ArrowUpDown, Edit, Trash2, Loader2, DollarSign } from 'lucide-react'
import { SortDirection, SortField } from '@/hooks/useAdminIngredients'

interface IngredientsAdminTableProps {
  ingredients: Ingredient[]
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
  onEdit: (id: number) => void
  onDelete: (ingredient: Ingredient) => void
  deletingId: number | null
}

export default function IngredientsAdminTable({
  ingredients,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  deletingId,
}: IngredientsAdminTableProps) {
  // Helper function to manage sorting icon classes
  const getSortIconClasses = (field: 'name' | 'price' | 'createdAt') => {
    if (sortField !== field) {
      return 'opacity-0 group-hover:opacity-50 transition-transform'
    }
    return `opacity-100 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`
  }

  // Format price
  const formatPrice = (price: number) => price

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
              onClick={() => onSort('price')}
            >
              <div className="flex items-center gap-1">
                <span>Price</span>
                <ArrowUpDown size={14} className={getSortIconClasses('price')} />
              </div>
            </th>
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
          {ingredients.map((ingredient) => (
            <tr key={ingredient.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={ingredient.imageUrl}
                    alt={ingredient.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Error'
                    }}
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{ingredient.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm font-medium text-green-600">
                  <DollarSign size={14} className="mr-1" />
                  {formatPrice(ingredient.price)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(ingredient.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary mr-2 inline-flex items-center gap-1"
                  onClick={() => onEdit(ingredient.id)}
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive inline-flex items-center gap-1"
                  onClick={() => onDelete(ingredient)}
                  disabled={deletingId === ingredient.id}
                >
                  {deletingId === ingredient.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
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
