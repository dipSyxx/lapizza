import React from 'react'
import { Button } from '@/components/ui'
import { ArrowUpDown, Edit, Trash2, Loader2, Tag, ShoppingBag } from 'lucide-react'
import { CategoryWithCount } from '@/services/adminCategories'

interface CategoriesTableProps {
  categories: CategoryWithCount[]
  sortField: 'name' | 'products' | 'createdAt'
  sortDirection: 'asc' | 'desc'
  onSort: (field: 'name' | 'products' | 'createdAt') => void
  onEdit: (id: number) => void
  onDelete: (category: CategoryWithCount) => void
  deletingId: number | null
}

export default function CategoriesAdminTable({
  categories,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  deletingId,
}: CategoriesTableProps) {
  const getIconClasses = (field: 'name' | 'products' | 'createdAt') => {
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
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center gap-1">
                <span>Name</span>
                <ArrowUpDown size={14} className={getIconClasses('name')} />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
              onClick={() => onSort('products')}
            >
              <div className="flex items-center gap-1">
                <span>Products Count</span>
                <ArrowUpDown size={14} className={getIconClasses('products')} />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
              onClick={() => onSort('createdAt')}
            >
              <div className="flex items-center gap-1">
                <span>Created At</span>
                <ArrowUpDown size={14} className={getIconClasses('createdAt')} />
              </div>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Tag className="h-8 w-8 rounded-md bg-indigo-100 p-1.5 text-indigo-500 mr-3" />
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-500">
                  <ShoppingBag size={14} className="mr-1 text-gray-400" />
                  <span className="font-medium">{category._count.products}</span>
                  <span className="ml-1">product{category._count.products !== 1 ? 's' : ''}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(category.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary mr-2 inline-flex items-center gap-1"
                  onClick={() => onEdit(category.id)}
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`inline-flex items-center gap-1 ${
                    category._count.products > 0 ? 'text-gray-400' : 'text-destructive'
                  }`}
                  onClick={() => onDelete(category)}
                  disabled={deletingId === category.id}
                  title={category._count.products > 0 ? 'Cannot delete category with products' : ''}
                >
                  {deletingId === category.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
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
