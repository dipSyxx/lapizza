import { CategoryWithCount } from "@/services/adminCategories"
import { Api } from "@/services/api-client"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { use, useState, useEffect } from "react"
import toast from "react-hot-toast"




export const useEditCategory = ({ params }: { params: Promise<{ id: string }> }) => {

  const resolvedParams = use(params)
  const categoryId = resolvedParams.id

  const [category, setCategory] = useState<CategoryWithCount | null>(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)
        const response = await Api.adminCategories.getAdminCategoryById(categoryId)
        setCategory(response)
        setName(response.name)
      } catch (error) {
        console.error('Error fetching category:', error)
        toast.error('Failed to load category')
        router.push('/admin/categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [categoryId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Category name is required')
      return
    }

    try {
      setSaving(true)
      await Api.adminCategories.updateAdminCategory(categoryId, name.trim())
      toast.success('Category updated successfully')
      router.push('/admin/categories')
      router.refresh()
    } catch (error: unknown) {
      console.error('Error updating category:', error)
      const axiosError = error as AxiosError<{ error: string }>
      setError(axiosError.response?.data?.error || 'Failed to update category')
      toast.error(axiosError.response?.data?.error || 'Failed to update category')
    } finally {
      setSaving(false)
    }
  }

  return {
    category,
    name,
    setName,
    loading,
    saving,
    error,
    router,
    handleSubmit
  }
}