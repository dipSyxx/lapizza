'use client'

import React, { ChangeEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { Plus, Loader2, AlertCircle } from 'lucide-react'
import DeleteConfirmationModal from '@/components/shared/modals/DeleteConfirmationModal'
import SearchBar from '@/components/shared/SearchBarAdmin'
import CategoriesTable from '@/components/shared/CategoriesAdminTable'
import { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import { Api } from '@/services/api-client'
import { CategoryWithCount } from '@/services/adminCategories'
import { useAdminCategories } from '@/hooks/useAdminCategories'

export default function CategoriesPage() {
  const router = useRouter()
  const { categories, loading, searchTerm, setSearchTerm, sortField, sortDirection, handleSort, fetchCategories } =
    useAdminCategories()

  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryWithCount | null>(null)

  const handleEdit = (id: number) => {
    router.push(`/admin/categories/${id}`)
  }

  const openDeleteModal = (category: CategoryWithCount) => {
    setCategoryToDelete(category)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setCategoryToDelete(null)
  }

  const handleDelete = async () => {
    if (!categoryToDelete) return

    try {
      setDeletingId(categoryToDelete.id)
      await Api.adminCategories.deleteAdminCategory(categoryToDelete.id.toString())
      toast.success('Category deleted successfully')
      fetchCategories()
      closeDeleteModal()
    } catch (error: unknown) {
      console.error('Error deleting category:', error)
      const axiosError = error as AxiosError<{ error: string }>
      toast.error(axiosError.response?.data?.error || 'Failed to delete category')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button asChild className="flex items-center gap-2">
          <Link href="/admin/categories/new">
            <Plus size={16} />
            <span>Add New Category</span>
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
        <SearchBar
          searchTerm={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <p className="text-gray-500">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <AlertCircle size={40} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No categories found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? `No categories matching "${searchTerm}"` : 'There are no categories in the database yet.'}
            </p>
            <Button asChild size="sm">
              <Link href="/admin/categories/new">Add your first category</Link>
            </Button>
          </div>
        ) : (
          <CategoriesTable
            categories={categories}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            deletingId={deletingId}
          />
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        category={categoryToDelete}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        isDeleting={deletingId !== null}
      />
    </div>
  )
}
