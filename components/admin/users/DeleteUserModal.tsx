'use client'
import React, { useEffect } from 'react'
import { X, AlertTriangle, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserResponse } from '@/services/adminUsers'

interface DeleteUserModalProps {
  isOpen: boolean
  user: UserResponse | null
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isOpen, user, onClose, onConfirm, isDeleting }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const isLoading = !user && isOpen

  if (!isOpen) return null

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center justify-center p-10">
            <Loader2 size={40} className="text-primary animate-spin" />
            <span className="ml-3 text-base text-gray-600">Loading user data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const isLastAdmin = user.role === 'ADMIN' && user._isLastAdmin

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
              <h4 className="text-base font-medium text-gray-900 mb-1">Delete user &quot;{user.fullName}&quot;?</h4>
              <p className="text-sm text-gray-500">
                {isLastAdmin
                  ? 'This is the only admin user. You cannot delete it as the system requires at least one admin.'
                  : `This action cannot be undone. This will permanently delete the user and all associated data.${
                      user._count.Orders > 0
                        ? ` This user has ${user._count.Orders} order${user._count.Orders !== 1 ? 's' : ''}.`
                        : ''
                    }`}
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
              disabled={isDeleting || isLastAdmin}
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

export default DeleteUserModal
