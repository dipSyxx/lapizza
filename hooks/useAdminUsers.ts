import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { UserRole } from '@prisma/client'
import { Api } from '@/services/api-client'
import { UserResponse } from '@/services/adminUsers'

export const useAdminUsers = () => {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL')
  const [sortField, setSortField] = useState<'fullName' | 'email' | 'createdAt' | 'Orders'>('fullName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await Api.adminUsers.getAllAdminUsers()
      setUsers(response)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSort = (field: 'fullName' | 'email' | 'createdAt' | 'Orders') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortField === 'fullName') {
      return sortDirection === 'asc'
        ? a.fullName.localeCompare(b.fullName)
        : b.fullName.localeCompare(a.fullName)
    } else if (sortField === 'email') {
      return sortDirection === 'asc'
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email)
    } else if (sortField === 'Orders') {
      return sortDirection === 'asc'
        ? a._count.Orders - b._count.Orders
        : b._count.Orders - a._count.Orders
    } else {
      return sortDirection === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return {
    users: sortedUsers,
    loading,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    sortField,
    sortDirection,
    handleSort,
    fetchUsers,
  }
}
