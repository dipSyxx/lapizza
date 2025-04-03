'use client'
import React, { useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserResponse } from '@/services/adminUsers'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { UserRole } from '@prisma/client'

interface EditUserModalProps {
  isOpen: boolean
  user: UserResponse | null
  onClose: () => void
  onSave: (data: { fullName: string; email: string; role: UserRole }) => void
  isSaving: boolean
}

const formSchema = z.object({
  fullName: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['USER', 'ADMIN']),
})

type FormValues = z.infer<typeof formSchema>

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, user, onClose, onSave, isSaving }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      role: 'USER' as UserRole,
    },
  })

  const isLoading = !user && isOpen

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      })
    }
  }, [user, reset])

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

  const onSubmit = (data: FormValues) => {
    onSave(data)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{user ? `Edit User: ${user.fullName}` : 'Edit User'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500" disabled={isSaving}>
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-10">
            <Loader2 size={40} className="text-primary animate-spin" />
            <span className="ml-3 text-base text-gray-600">Loading user data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Full Name</div>
                <Input id="fullName" placeholder="Enter full name" {...register('fullName')} disabled={isSaving} />
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Email</div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  {...register('email')}
                  disabled={isSaving}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Role</div>
                <Select
                  defaultValue={user?.role || 'USER'}
                  onValueChange={(value) => setValue('role', value as UserRole)}
                  disabled={isSaving}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default EditUserModal
