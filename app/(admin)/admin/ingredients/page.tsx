'use client'

import React, { ChangeEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { Plus, Loader2, AlertCircle } from 'lucide-react'
import { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import { Ingredient } from '@prisma/client'
import { Api } from '@/services/api-client'
import { useAdminIngredients } from '@/hooks'
import SearchBarAdmin from '@/components/shared/SearchBarAdmin'
import IngredientsAdminTable from '@/components/shared/IngredientsAdminTable'
import DeleteAdminIngredientsConfirmationModals from '@/components/shared/modals/DeleteAdminIngredientsConfirmationModals'

export default function IngredientsPage() {
  const router = useRouter()

  // Call our hook for working with ingredients
  const { ingredients, loading, searchTerm, setSearchTerm, sortField, sortDirection, handleSort, fetchIngredients } =
    useAdminIngredients()

  // State for delete modal
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null)
  const [ingredientInUse, setIngredientInUse] = useState(false)

  // Handle edit
  const handleEdit = (id: number) => {
    router.push(`/admin/ingredients/${id}`)
  }

  // Open delete modal with check for ingredient usage
  const openDeleteModal = async (ingredient: Ingredient) => {
    setIngredientToDelete(ingredient)
    try {
      // If request is successful - we consider the ingredient is not used
      await Api.adminIngredients.getAdminIngredientById(ingredient.id.toString())
      setIngredientInUse(false)
      setDeleteModalOpen(true)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error: string }>
      if (axiosError.response?.data?.error?.includes('used in products')) {
        setIngredientInUse(true)
        setDeleteModalOpen(true)
      } else {
        toast.error('Failed to check ingredient usage')
      }
    }
  }

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setIngredientToDelete(null)
    setIngredientInUse(false)
  }

  // Delete ingredient
  const handleDelete = async () => {
    if (!ingredientToDelete) return
    try {
      setDeletingId(ingredientToDelete.id)
      await Api.adminIngredients.deleteAdminIngredient(ingredientToDelete.id.toString())
      toast.success('Ingredient deleted successfully')
      fetchIngredients() // update list
      closeDeleteModal()
    } catch (error: unknown) {
      console.error('Error deleting ingredient:', error)
      const axiosError = error as AxiosError<{ error: string }>
      toast.error(axiosError.response?.data?.error || 'Failed to delete ingredient')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      {/* Заголовок сторінки + кнопка додавання */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Ingredients</h1>
        <Button asChild className="flex items-center gap-2">
          <Link href="/admin/ingredients/new">
            <Plus size={16} />
            <span>Add New Ingredient</span>
          </Link>
        </Button>
      </div>

      {/* Container for search + table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {/* Search field */}
        <SearchBarAdmin
          searchTerm={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />

        {/* Main content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <p className="text-gray-500">Loading ingredients...</p>
          </div>
        ) : ingredients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <AlertCircle size={40} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No ingredients found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? `No ingredients matching "${searchTerm}"` : 'There are no ingredients in the database yet.'}
            </p>
            <Button asChild size="sm">
              <Link href="/admin/ingredients/new">Add your first ingredient</Link>
            </Button>
          </div>
        ) : (
          <IngredientsAdminTable
            ingredients={ingredients}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            deletingId={deletingId}
          />
        )}
      </div>

      {/* Delete modal */}
      <DeleteAdminIngredientsConfirmationModals
        isOpen={deleteModalOpen}
        ingredient={ingredientToDelete}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        isDeleting={deletingId !== null}
        inUse={ingredientInUse}
      />
    </div>
  )
}
