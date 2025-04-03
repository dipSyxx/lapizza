'use client'

import { UserRole } from '@prisma/client'
import { Search, Loader2, AlertCircle, ArrowUpDown, User, Calendar, Mail, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAdminUsers } from '@/hooks'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UserResponse } from '@/services/adminUsers'
import EditUserModal from '@/components/admin/users/EditUserModal'
import DeleteUserModal from '@/components/admin/users/DeleteUserModal'
import { Api } from '@/services/api-client'
import { toast } from 'react-hot-toast'

export default function AdminUsersPage() {
  const {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    sortField,
    sortDirection,
    handleSort,
    fetchUsers,
  } = useAdminUsers()

  // State for selected user
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)

  // State for loading user data
  const [loadingUser, setLoadingUser] = useState(false)

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // State for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Handler to fetch user details and open edit modal
  const handleOpenEditModal = async (userId: string) => {
    setIsEditModalOpen(true)
    setLoadingUser(true)

    try {
      const user = await Api.adminUsers.getAdminUserById(userId)
      setSelectedUser(user)
    } catch (error) {
      console.error('Error fetching user details:', error)
      toast.error('Failed to load user details')
      setIsEditModalOpen(false)
    } finally {
      setLoadingUser(false)
    }
  }

  // Handler to fetch user details and open delete modal
  const handleOpenDeleteModal = async (userId: string) => {
    setIsDeleteModalOpen(true)
    setLoadingUser(true)

    try {
      const user = await Api.adminUsers.getAdminUserById(userId)
      setSelectedUser(user)
    } catch (error) {
      console.error('Error fetching user details:', error)
      toast.error('Failed to load user details')
      setIsDeleteModalOpen(false)
    } finally {
      setLoadingUser(false)
    }
  }

  // Handler to save user changes
  const handleSaveUser = async (data: { fullName: string; email: string; role: UserRole }) => {
    if (!selectedUser) return

    try {
      setIsSaving(true)
      await Api.adminUsers.updateAdminUser(selectedUser.id.toString(), data)
      toast.success('User updated successfully')
      setIsEditModalOpen(false)
      fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    } finally {
      setIsSaving(false)
    }
  }

  // Handler to delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      setIsDeleting(true)
      await Api.adminUsers.deleteAdminUser(selectedUser.id.toString())
      toast.success('User deleted successfully')
      setIsDeleteModalOpen(false)
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    } finally {
      setIsDeleting(false)
    }
  }

  // Close modal handlers
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedUser(null)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedUser(null)
  }

  // Helper function to manage sorting icon classes
  const getSortIconClasses = (field: string) => {
    if (sortField !== field) {
      return 'opacity-0 group-hover:opacity-50 transition-transform'
    }
    return `opacity-100 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>

      <Card>
        <CardHeader className="px-5 py-4 flex flex-col sm:flex-row justify-between gap-4 bg-muted/20">
          <div className="flex relative w-full sm:w-64 items-center">
            <Search className="absolute left-2 top-3.6 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ marginTop: '0px' }}>
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | 'ALL')}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={40} className="text-primary animate-spin mb-4" />
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <AlertCircle size={40} className="text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? `No users matching "${searchTerm}"`
                  : roleFilter !== 'ALL'
                  ? `No users with role "${roleFilter}"`
                  : 'There are no users in the database yet.'}
              </p>
            </div>
          ) : (
            <div className="rounded-md">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                        onClick={() => handleSort('fullName')}
                      >
                        <div className="flex items-center gap-1">
                          <span>Name</span>
                          <ArrowUpDown size={14} className={getSortIconClasses('fullName')} />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center gap-1">
                          <span>Email</span>
                          <ArrowUpDown size={14} className={getSortIconClasses('email')} />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                        onClick={() => handleSort('Orders')}
                      >
                        <div className="flex items-center gap-1">
                          <span>Orders</span>
                          <ArrowUpDown size={14} className={getSortIconClasses('Orders')} />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Verified
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center gap-1">
                          <span>Created</span>
                          <ArrowUpDown size={14} className={getSortIconClasses('createdAt')} />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-500 mr-2" />
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <ShoppingBag className="h-4 w-4 text-gray-500 mr-2" />
                            <div className="text-sm text-gray-500">{user._count.Orders} orders</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.verified ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                            <div className="text-sm text-gray-500">{format(new Date(user.createdAt), 'PP')}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary mr-2 inline-flex items-center gap-1"
                            onClick={() => handleOpenEditModal(user.id.toString())}
                            disabled={loadingUser}
                          >
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive inline-flex items-center gap-1"
                            onClick={() => handleOpenDeleteModal(user.id.toString())}
                            disabled={loadingUser}
                          >
                            <span>Delete</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        user={selectedUser}
        onClose={handleCloseEditModal}
        onSave={handleSaveUser}
        isSaving={isSaving}
      />

      {/* Delete Modal */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        user={selectedUser}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteUser}
        isDeleting={isDeleting}
      />
    </div>
  )
}
