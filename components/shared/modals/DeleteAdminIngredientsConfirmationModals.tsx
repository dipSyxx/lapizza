'use client'

import React from 'react'
import { Ingredient } from '@prisma/client'
import { Button } from '@/components/ui'
import { X, Loader2, Trash2, AlertTriangle } from 'lucide-react'

interface DeleteModalProps {
  isOpen: boolean
  ingredient: Ingredient | null
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
  inUse: boolean
}

export default function DeleteAdminIngredientsConfirmationModals({
  isOpen,
  ingredient,
  onClose,
  onConfirm,
  isDeleting,
  inUse,
}: DeleteModalProps) {
  if (!isOpen || !ingredient) return null

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
              <h4 className="text-base font-medium text-gray-900 mb-1">
                Delete ingredient &quot;{ingredient.name}&quot;?
              </h4>
              <p className="text-sm text-gray-500">
                {inUse
                  ? 'This ingredient is used in products. You cannot delete it until it is removed from all products.'
                  : 'This action cannot be undone. This will permanently delete the ingredient.'}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting || inUse}
              className="flex items-center gap-2"
            >
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
