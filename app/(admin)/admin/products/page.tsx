/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import {
  Plus,
  Search,
  ArrowUpDown,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  AlertTriangle,
  Pizza,
  Package,
} from 'lucide-react'
import { Category, Product, ProductItem } from '@prisma/client'

// Extended type for product with category
interface ProductWithCategory extends Product {
  category: Category
  items: ProductItem[]
}

// Type for the deletion confirmation modal
interface DeleteModalProps {
  isOpen: boolean
  product: ProductWithCategory | null
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}

// Component for the deletion confirmation modal
function DeleteConfirmationModal({ isOpen, product, onClose, onConfirm, isDeleting }: DeleteModalProps) {
  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500" disabled={isDeleting}>
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h4 className="text-base font-medium text-gray-900 mb-1">Delete product &quot;{product.name}&quot;?</h4>
              <p className="text-sm text-gray-500">
                This action cannot be undone. This will permanently delete the product and all its variants.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={isDeleting} className="flex items-center gap-2">
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Delete</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<'name' | 'category' | 'createdAt'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<ProductWithCategory | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get<ProductWithCategory[]>('/api/admin/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const openDeleteModal = (product: ProductWithCategory) => {
    setProductToDelete(product)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setProductToDelete(null)
  }

  const handleDelete = async () => {
    if (!productToDelete) return

    try {
      setDeletingId(productToDelete.id)
      await axios.delete(`/api/admin/products/${productToDelete.id}`)
      toast.success('Product deleted successfully')
      fetchProducts()
      closeDeleteModal()
    } catch (error: unknown) {
      console.error('Error deleting product:', error)
      const axiosError = error as AxiosError<{ error: string }>
      toast.error(axiosError.response?.data?.error || 'Failed to delete product')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSort = (field: 'name' | 'category' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortField === 'category') {
      return sortDirection === 'asc'
        ? a.category.name.localeCompare(b.category.name)
        : b.category.name.localeCompare(a.category.name)
    } else {
      return sortDirection === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  // Determine if the product is a pizza
  const isPizza = (product: ProductWithCategory) => {
    // Check if the product has related elements with size or pizza type
    return product.items?.some((item: ProductItem) => item.size !== null || item.pizzaType !== null) || false
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild className="flex items-center gap-2">
          <Link href="/admin/products/new">
            <Plus size={16} />
            <span>Add New Product</span>
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products by name or category..."
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <AlertCircle size={40} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? `No products matching "${searchTerm}"` : 'There are no products in the database yet.'}
            </p>
            <Button asChild size="sm">
              <Link href="/admin/products/new">Add your first product</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Name</span>
                      <ArrowUpDown
                        size={14}
                        className={`transition-opacity ${
                          sortField === 'name' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Category</span>
                      <ArrowUpDown
                        size={14}
                        className={`transition-opacity ${
                          sortField === 'category' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                        }`}
                      />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Created At</span>
                      <ArrowUpDown
                        size={14}
                        className={`transition-opacity ${
                          sortField === 'createdAt' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                        }`}
                      />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.map((product) => (
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
                        onClick={() => router.push(`/admin/products/${product.id}`)}
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive inline-flex items-center gap-1"
                        onClick={() => openDeleteModal(product)}
                        disabled={deletingId === product.id}
                      >
                        {deletingId === product.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        <span>Delete</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        product={productToDelete}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        isDeleting={deletingId !== null}
      />
    </div>
  )
}
