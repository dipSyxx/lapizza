'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Loader2, Tag } from 'lucide-react'
import Link from 'next/link'
import { Api } from '@/services/api-client'

export default function NewCategoryPage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Category name is required')
      return
    }

    try {
      setLoading(true)
      await Api.adminCategories.createAdminCategory(name.trim())
      toast.success('Category created successfully')
      router.push('/admin/categories')
      router.refresh()
    } catch (error: unknown) {
      console.error('Error creating category:', error)
      const axiosError = error as AxiosError<{ error: string }>
      setError(axiosError.response?.data?.error || 'Failed to create category')
      toast.error(axiosError.response?.data?.error || 'Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/categories" className="text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold">Add New Category</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`pl-10 block w-full rounded-md border ${
                    error ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                  placeholder="Enter category name"
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/categories')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Category'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
