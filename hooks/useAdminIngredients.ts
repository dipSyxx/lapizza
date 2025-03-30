  import { useState, useEffect } from 'react'
  import { toast } from 'react-hot-toast'
  import { Api } from '@/services/api-client'
  import { Ingredient } from '@prisma/client'

  export type SortField = 'name' | 'price' | 'createdAt'
  export type SortDirection = 'asc' | 'desc'

  export const useAdminIngredients = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [loading, setLoading] = useState(true)

    // Search
    const [searchTerm, setSearchTerm] = useState('')

    // Sort
    const [sortField, setSortField] = useState<SortField>('name')
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

    // Fetch ingredients
    const fetchIngredients = async () => {
      try {
        setLoading(true)
        const response = await Api.adminIngredients.getAllAdminIngredients()
        setIngredients(response)
      } catch (error) {
        console.error('Error fetching ingredients:', error)
        toast.error('Failed to load ingredients')
      } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchIngredients()
  }, [])

    // Handle sort
    const handleSort = (field: SortField) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
      } else {
        setSortField(field)
        setSortDirection('asc')
      }
    }

    // Filter
    const filtered = ingredients.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      } else if (sortField === 'price') {
        return sortDirection === 'asc'
          ? a.price - b.price
          : b.price - a.price
      } else {
        return sortDirection === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return {
      ingredients: sorted,
      loading,
      searchTerm,
      setSearchTerm,
      sortField,
      sortDirection,
      handleSort,
      fetchIngredients,
    }
  }
