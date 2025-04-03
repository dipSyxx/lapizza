import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { UserRole } from '@prisma/client'
import { Api } from '@/services/api-client'
import { UserResponse } from '@/services/adminUsers'
import { AxiosError } from 'axios'

interface EditUserFormData {
  fullName: string
  email: string
  role: UserRole
}

interface ErrorResponse {
  error: string
}

export const useEditUser = (onSuccess?: () => void) => {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const fetchUser = useCallback(async (id: string) => {
    if (!id) return

    try {
      setLoading(true)
      const userData = await Api.adminUsers.getAdminUserById(id)
      setUser(userData)
    } catch (error) {
      console.error('Error fetching user:', error)
      const axiosError = error as AxiosError<ErrorResponse>
      const errorMessage = axiosError.response?.data?.error || 'Failed to load user details'
      toast.error(errorMessage)

      // Set user to null in case of error
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (id: string, data: EditUserFormData) => {
    if (!id) return

    try {
      setFormLoading(true)
      await Api.adminUsers.updateAdminUser(id, data)
      toast.success('User updated successfully')
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error updating user:', error)
      const axiosError = error as AxiosError<ErrorResponse>
      const errorMessage = axiosError.response?.data?.error || 'Failed to update user'
      toast.error(errorMessage)
    } finally {
      setFormLoading(false)
    }
  }, [onSuccess])

  const deleteUser = useCallback(async (id: string) => {
    if (!id) return

    try {
      setFormLoading(true)
      await Api.adminUsers.deleteAdminUser(id)
      toast.success('User deleted successfully')
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error deleting user:', error)
      const axiosError = error as AxiosError<ErrorResponse>
      const errorMessage = axiosError.response?.data?.error || 'Failed to delete user'
      toast.error(errorMessage)
    } finally {
      setFormLoading(false)
    }
  }, [onSuccess])

  return {
    user,
    loading,
    formLoading,
    fetchUser,
    updateUser,
    deleteUser
  }
}
