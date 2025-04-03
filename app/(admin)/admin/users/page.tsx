'use client'

import { UserRole } from '@prisma/client'
import { Search, Loader2, AlertCircle, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'

import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SortButton } from '@/components/admin/shared/sort-button'
import { useAdminUsers } from '@/hooks'
import { Badge } from '@/components/ui/badge'
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>

      <Card>
        <CardHeader className="px-5 py-4 flex flex-col sm:flex-row justify-between gap-4 bg-muted/20">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead>
                      <SortButton
                        active={sortField === 'fullName'}
                        direction={sortField === 'fullName' ? sortDirection : 'asc'}
                        onClick={() => handleSort('fullName')}
                      >
                        Name
                      </SortButton>
                    </TableHead>
                    <TableHead>
                      <SortButton
                        active={sortField === 'email'}
                        direction={sortField === 'email' ? sortDirection : 'asc'}
                        onClick={() => handleSort('email')}
                      >
                        Email
                      </SortButton>
                    </TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>
                      <SortButton
                        active={sortField === 'Orders'}
                        direction={sortField === 'Orders' ? sortDirection : 'asc'}
                        onClick={() => handleSort('Orders')}
                      >
                        Orders
                      </SortButton>
                    </TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>
                      <SortButton
                        active={sortField === 'createdAt'}
                        direction={sortField === 'createdAt' ? sortDirection : 'asc'}
                        onClick={() => handleSort('createdAt')}
                      >
                        Created
                      </SortButton>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user._count.Orders}</TableCell>
                      <TableCell>
                        <Badge variant={user.verified ? 'default' : 'destructive'}>
                          {user.verified ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(user.createdAt), 'PP')}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleOpenEditModal(user.id.toString())}
                              disabled={loadingUser}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleOpenDeleteModal(user.id.toString())}
                              disabled={loadingUser}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
