/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Loader2, DollarSign, Image, Tag, Trash2, Plus, Pizza, Package, Check } from 'lucide-react'
import Link from 'next/link'
import { Category, Ingredient } from '@prisma/client'

// Types for data returned by API
type CategoryResponse = Category[]
type IngredientResponse = Ingredient[]

// Type for product variant (ProductItem)
interface ProductVariant {
  price: number
  size: number | null
  pizzaType: number | null
}

// Enumerations for pizza sizes and types
enum PizzaSize {
  Small = 20,
  Medium = 30,
  Large = 40,
}

enum PizzaType {
  Traditional = 2,
  Thin = 1,
}

export default function NewProductPage() {
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [isPizza, setIsPizza] = useState(false)
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      price: 0,
      size: null,
      pizzaType: null,
    },
  ])
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([])

  const [categories, setCategories] = useState<Category[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    imageUrl?: string
    categoryId?: string
    variants?: string
    general?: string
  }>({})

  const router = useRouter()

  // Load categories and ingredients
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<CategoryResponse>('/api/admin/categories')
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories')
      }
    }

    const fetchIngredients = async () => {
      try {
        const response = await axios.get<IngredientResponse>('/api/admin/ingredients')
        setIngredients(response.data)
      } catch (error) {
        console.error('Error fetching ingredients:', error)
        toast.error('Failed to load ingredients')
      }
    }

    fetchCategories()
    fetchIngredients()
  }, [])

  // Form validation
  const validateForm = () => {
    const newErrors: {
      name?: string
      imageUrl?: string
      categoryId?: string
      variants?: string
    } = {}
    let isValid = true

    if (!name.trim()) {
      newErrors.name = 'Product name is required'
      isValid = false
    }

    if (!imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required'
      isValid = false
    }

    if (!categoryId) {
      newErrors.categoryId = 'Category is required'
      isValid = false
    }

    if (variants.length === 0) {
      newErrors.variants = 'At least one variant is required'
      isValid = false
    }

    // Check variants
    for (const variant of variants) {
      if (typeof variant.price !== 'number' || variant.price <= 0) {
        newErrors.variants = 'All variants must have a valid price'
        isValid = false
        break
      }
    }

    // For regular product, there must be exactly one variant without size and type
    if (!isPizza && (variants.length !== 1 || variants[0].size !== null || variants[0].pizzaType !== null)) {
      newErrors.variants = 'Regular product must have exactly one variant without size and type'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      await axios.post('/api/admin/products', {
        name: name.trim(),
        imageUrl: imageUrl.trim(),
        categoryId,
        items: variants,
        ingredients: isPizza ? selectedIngredients : [],
        isPizza,
      })
      toast.success('Product created successfully')
      router.push('/admin/products')
      router.refresh()
    } catch (error: unknown) {
      console.error('Error creating product:', error)
      const axiosError = error as AxiosError<{ error: string }>
      setErrors({
        general: axiosError.response?.data?.error || 'Failed to create product',
      })
      toast.error(axiosError.response?.data?.error || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  // Add a new product variant
  const addVariant = () => {
    if (isPizza) {
      // For pizza, add a variant with size and type
      setVariants([
        ...variants,
        {
          price: 0,
          size: PizzaSize.Medium,
          pizzaType: PizzaType.Traditional,
        },
      ])
    } else {
      // For regular product, add only one variant without size and type
      setVariants([
        {
          price: 0,
          size: null,
          pizzaType: null,
        },
      ])
    }
  }

  // Remove a product variant
  const removeVariant = (index: number) => {
    const newVariants = [...variants]
    newVariants.splice(index, 1)
    setVariants(newVariants)
  }

  // Update a product variant
  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    const newVariants = [...variants]
    newVariants[index] = {
      ...newVariants[index],
      [field]: field === 'price' ? parseFloat(value.toString()) : value,
    }
    setVariants(newVariants)
  }

  // Toggle product type
  const toggleProductType = (isPizzaValue: boolean) => {
    if (isPizzaValue !== isPizza) {
      setIsPizza(isPizzaValue)

      // Reset variants when changing product type
      if (isPizzaValue) {
        // For pizza, add a variant with size and type
        setVariants([
          {
            price: variants.length > 0 ? variants[0].price : 0,
            size: PizzaSize.Medium,
            pizzaType: PizzaType.Traditional,
          },
        ])
        // Reset ingredients
        setSelectedIngredients([])
      } else {
        // For regular product, add only one variant without size and type
        setVariants([
          {
            price: variants.length > 0 ? variants[0].price : 0,
            size: null,
            pizzaType: null,
          },
        ])
        // Clear ingredients
        setSelectedIngredients([])
      }
    }
  }

  // Toggle ingredient selection
  const toggleIngredient = (ingredient: Ingredient) => {
    const isSelected = selectedIngredients.some((ing) => ing.id === ingredient.id)

    if (isSelected) {
      setSelectedIngredients(selectedIngredients.filter((ing) => ing.id !== ingredient.id))
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient])
    }
  }

  // Format price
  const formatPrice = (price: number) => {
    return price
  }

  // Get pizza size name
  const getSizeName = (size: number | null) => {
    switch (size) {
      case PizzaSize.Small:
        return 'Small (20 cm)'
      case PizzaSize.Medium:
        return 'Medium (30 cm)'
      case PizzaSize.Large:
        return 'Large (40 cm)'
      default:
        return 'Unknown'
    }
  }

  // Get pizza type name
  const getTypeName = (type: number | null) => {
    switch (type) {
      case PizzaType.Traditional:
        return 'Traditional'
      case PizzaType.Thin:
        return 'Thin'
      default:
        return 'Unknown'
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/products" className="text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold">Create New Product</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Product type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={isPizza ? 'outline' : 'default'}
                  className="flex items-center gap-2"
                  onClick={() => toggleProductType(false)}
                >
                  <Package size={16} />
                  <span>Regular Product</span>
                </Button>
                <Button
                  type="button"
                  variant={isPizza ? 'default' : 'outline'}
                  className="flex items-center gap-2"
                  onClick={() => toggleProductType(true)}
                >
                  <Pizza size={16} />
                  <span>Pizza</span>
                </Button>
              </div>
            </div>

            {/* Product name */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`block w-full rounded-md border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                  placeholder="Enter product name"
                />
              </div>
              {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Image URL */}
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

            {/* Image preview */}
            {imageUrl && (
              <div className="mb-6">
                <p className="block text-sm font-medium text-gray-700 mb-2">Image Preview</p>
                <div className="h-40 w-40 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={imageUrl}
                    alt={name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Category */}
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="category"
                  name="category"
                  value={categoryId || ''}
                  onChange={(e) => setCategoryId(parseInt(e.target.value))}
                  className={`pl-10 block w-full rounded-md border ${
                    errors.categoryId ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.categoryId && <p className="mt-2 text-sm text-red-600">{errors.categoryId}</p>}
            </div>

            {/* Product variants */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {isPizza ? 'Pizza Variants' : 'Product Price'}
                </label>
                {isPizza && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariant}
                    className="flex items-center gap-1"
                  >
                    <Plus size={14} />
                    <span>Add Variant</span>
                  </Button>
                )}
              </div>

              {errors.variants && <p className="mt-2 mb-4 text-sm text-red-600">{errors.variants}</p>}

              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex flex-wrap gap-4">
                      {isPizza && (
                        <>
                          {/* Pizza size */}
                          <div className="w-full sm:w-auto">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Size</label>
                            <select
                              value={variant.size || ''}
                              onChange={(e) => updateVariant(index, 'size', parseInt(e.target.value))}
                              className="block w-full rounded-md border border-gray-300 shadow-sm py-1.5 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            >
                              <option value={PizzaSize.Small}>Small (20 cm)</option>
                              <option value={PizzaSize.Medium}>Medium (30 cm)</option>
                              <option value={PizzaSize.Large}>Large (40 cm)</option>
                            </select>
                          </div>

                          {/* Pizza type */}
                          <div className="w-full sm:w-auto">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Crust Type</label>
                            <select
                              value={variant.pizzaType || ''}
                              onChange={(e) => updateVariant(index, 'pizzaType', parseInt(e.target.value))}
                              className="block w-full rounded-md border border-gray-300 shadow-sm py-1.5 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            >
                              <option value={PizzaType.Traditional}>Traditional</option>
                              <option value={PizzaType.Thin}>Thin</option>
                            </select>
                          </div>
                        </>
                      )}

                      {/* Price */}
                      <div className="w-full sm:w-auto">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            value={variant.price}
                            onChange={(e) => updateVariant(index, 'price', e.target.value)}
                            className="pl-8 block w-full rounded-md border border-gray-300 shadow-sm py-1.5 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      {/* Delete button */}
                      {isPizza && variants.length > 1 && (
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariant(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Variant information */}
                    {isPizza && (
                      <div className="mt-2 text-xs text-gray-500">
                        {getSizeName(variant.size)}, {getTypeName(variant.pizzaType)} - ${formatPrice(variant.price)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients (only for pizza) */}
            {isPizza && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>

                {ingredients.length === 0 ? (
                  <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
                    <p className="text-gray-500">No ingredients available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {ingredients.map((ingredient) => {
                      const isSelected = selectedIngredients.some((ing) => ing.id === ingredient.id)
                      return (
                        <div
                          key={ingredient.id}
                          className={`p-2 border rounded-md flex items-center gap-2 cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => toggleIngredient(ingredient)}
                        >
                          <div className="h-8 w-8 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                            <img
                              src={ingredient.imageUrl}
                              alt={ingredient.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Error'
                              }}
                            />
                          </div>
                          <span className="text-sm">{ingredient.name}</span>
                          <div className="ml-auto">
                            {isSelected ? (
                              <Check size={16} className="text-primary" />
                            ) : (
                              <Plus size={16} className="text-gray-400" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/products')} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
