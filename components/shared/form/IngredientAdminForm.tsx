/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui'
import { Loader2, DollarSign, Image, Utensils } from 'lucide-react'
import { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import { Ingredient } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Api } from '@/services/api-client'

interface IngredientFormProps {
  ingredient: Ingredient
  onSave: () => void
}

export const IngredientAdminForm = ({ ingredient, onSave }: IngredientFormProps) => {
  const router = useRouter()

  const [name, setName] = useState(ingredient.name)
  const [price, setPrice] = useState(ingredient.price.toString())
  const [imageUrl, setImageUrl] = useState(ingredient.imageUrl)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    price?: string
    imageUrl?: string
    general?: string
  }>({})

  const validateForm = () => {
    const newErrors: { name?: string; price?: string; imageUrl?: string } = {}
    let isValid = true

    if (!name.trim()) {
      newErrors.name = 'Ingredient name is required'
      isValid = false
    }

    if (!price.trim()) {
      newErrors.price = 'Price is required'
      isValid = false
    } else {
      const priceValue = parseFloat(price)
      if (isNaN(priceValue) || priceValue < 0) {
        newErrors.price = 'Price must be a valid positive number'
        isValid = false
      }
    }

    if (!imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      await Api.adminIngredients.updateAdminIngredient(ingredient.id.toString(), {
        name: name.trim(),
        price: parseFloat(price),
        imageUrl: imageUrl.trim(),
      })
      toast.success('Ingredient updated successfully')
      onSave()
      router.push('/admin/ingredients')
      router.refresh()
    } catch (error: unknown) {
      console.error('Error updating ingredient:', error)
      const axiosError = error as AxiosError<{ error: string }>
      setErrors({
        general: axiosError.response?.data?.error || 'Failed to update ingredient',
      })
      toast.error(axiosError.response?.data?.error || 'Failed to update ingredient')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl">
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Ingredient Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Utensils className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`pl-10 block w-full rounded-md border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                placeholder="Enter ingredient name"
              />
            </div>
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="price"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`pl-10 block w-full rounded-md border ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                } shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                placeholder="Enter price"
              />
            </div>
            {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Image className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={`pl-10 block w-full rounded-md border ${
                  errors.imageUrl ? 'border-red-300' : 'border-gray-300'
                } shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                placeholder="Enter image URL"
              />
            </div>
            {errors.imageUrl && <p className="mt-2 text-sm text-red-600">{errors.imageUrl}</p>}
          </div>

          <div className="mb-6">
            <p className="block text-sm font-medium text-gray-700 mb-2">Image Preview</p>
            <div className="h-40 w-40 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
                alt={name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error'
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/ingredients')} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
