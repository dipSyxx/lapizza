'use client'

import React, { ChangeEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { Plus, Loader2, AlertCircle } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import useAdminProducts, { ProductWithCategory } from '@/hooks/useAdminProducts'
import SearchBarAdmin from '@/components/shared/SearchBarAdmin'
import ProductsAdminTable from '@/components/shared/ProductsAdminTable'
import DeleteAdminProductsModal from '@/components/shared/modals/DeleteAdminProductsModal'

export default function ProductsPage() {
  const router = useRouter()
  const { products, loading, searchTerm, setSearchTerm, sortField, sortDirection, handleSort, fetchProducts } =
    useAdminProducts()

  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<ProductWithCategory | null>(null)

  const handleEdit = (id: number) => {
    router.push(`/admin/products/${id}`)
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
      closeDeleteModal()
    } catch (error: unknown) {
      console.error('Error deleting product:', error)
      const axiosError = error as AxiosError<{ error: string }>
      toast.error(axiosError.response?.data?.error || 'Failed to delete product')
    } finally {
      setDeletingId(null)
      await fetchProducts()
    }
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
        <SearchBarAdmin
          searchTerm={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
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
          <ProductsAdminTable
            products={products}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            deletingId={deletingId}
          />
        )}
      </div>

      <DeleteAdminProductsModal
        isOpen={deleteModalOpen}
        product={productToDelete}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        isDeleting={deletingId !== null}
      />
    </div>
  )
}
