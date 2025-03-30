/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect, use } from 'react'
import { Button } from '@/components/ui'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Loader2, DollarSign, Image, Tag, Trash2, Plus, Pizza, Package, Check } from 'lucide-react'
import Link from 'next/link'
import { Category, Ingredient, Product, ProductItem } from '@prisma/client'

// Типы для данных, возвращаемых API
type ProductWithRelations = Product & {
  category: Category
  items: ProductItem[]
  ingredients: Ingredient[]
}

type CategoryResponse = Category[]
type IngredientResponse = Ingredient[]

// Тип для варианта продукта (ProductItem)
interface ProductVariant {
  id?: number
  price: number
  size: number | null
  pizzaType: number | null
}

// Перечисления для размеров и типов пиццы
enum PizzaSize {
  Small = 20,
  Medium = 30,
  Large = 40,
}

enum PizzaType {
  Traditional = 2,
  Thin = 1,
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const productId = parseInt(resolvedParams.id)

  const [product, setProduct] = useState<ProductWithRelations | null>(null)
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [isPizza, setIsPizza] = useState(false)
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([])

  const [categories, setCategories] = useState<Category[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    imageUrl?: string
    categoryId?: string
    variants?: string
    general?: string
  }>({})

  const router = useRouter()

  // Загрузка данных продукта
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await axios.get<ProductWithRelations>(`/api/admin/products/${productId}`)
        const productData = response.data

        setProduct(productData)
        setName(productData.name)
        setImageUrl(productData.imageUrl)
        setCategoryId(productData.categoryId)

        // Определяем, является ли продукт пиццей
        const hasPizzaItems = productData.items.some((item) => item.size !== null || item.pizzaType !== null)
        setIsPizza(hasPizzaItems)

        // Устанавливаем варианты продукта
        setVariants(
          productData.items.map((item) => ({
            id: item.id,
            price: item.price,
            size: item.size,
            pizzaType: item.pizzaType,
          })),
        )

        // Устанавливаем выбранные ингредиенты
        setSelectedIngredients(productData.ingredients)
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product')
        router.push('/admin/products')
      } finally {
        setLoading(false)
      }
    }

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

    fetchProduct()
    fetchCategories()
    fetchIngredients()
  }, [productId, router])

  // Валидация формы
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

    // Проверка вариантов
    for (const variant of variants) {
      if (typeof variant.price !== 'number' || variant.price <= 0) {
        newErrors.variants = 'All variants must have a valid price'
        isValid = false
        break
      }
    }

    // Для обычного продукта должен быть только один вариант без размера и типа
    if (!isPizza && (variants.length !== 1 || variants[0].size !== null || variants[0].pizzaType !== null)) {
      newErrors.variants = 'Regular product must have exactly one variant without size and type'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      await axios.put(`/api/admin/products/${productId}`, {
        name: name.trim(),
        imageUrl: imageUrl.trim(),
        categoryId,
        items: variants,
        ingredients: isPizza ? selectedIngredients : [],
        isPizza,
      })
      toast.success('Product updated successfully')
      router.push('/admin/products')
      router.refresh()
    } catch (error: unknown) {
      console.error('Error updating product:', error)
      const axiosError = error as AxiosError<{ error: string }>
      setErrors({
        general: axiosError.response?.data?.error || 'Failed to update product',
      })
      toast.error(axiosError.response?.data?.error || 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  // Добавление нового варианта продукта
  const addVariant = () => {
    if (isPizza) {
      // Для пиццы добавляем вариант с размером и типом
      setVariants([
        ...variants,
        {
          price: 0,
          size: PizzaSize.Medium,
          pizzaType: PizzaType.Traditional,
        },
      ])
    } else {
      // Для обычного продукта добавляем только один вариант без размера и типа
      setVariants([
        {
          price: 0,
          size: null,
          pizzaType: null,
        },
      ])
    }
  }

  // Удаление варианта продукта
  const removeVariant = (index: number) => {
    const newVariants = [...variants]
    newVariants.splice(index, 1)
    setVariants(newVariants)
  }

  // Обновление варианта продукта
  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    const newVariants = [...variants]
    newVariants[index] = {
      ...newVariants[index],
      [field]: field === 'price' ? parseFloat(value.toString()) : value,
    }
    setVariants(newVariants)
  }

  // Переключение типа продукта
  const toggleProductType = (isPizzaValue: boolean) => {
    if (isPizzaValue !== isPizza) {
      setIsPizza(isPizzaValue)

      // Сбрасываем варианты при изменении типа продукта
      if (isPizzaValue) {
        // Для пиццы добавляем вариант с размером и типом
        setVariants([
          {
            price: variants.length > 0 ? variants[0].price : 0,
            size: PizzaSize.Medium,
            pizzaType: PizzaType.Traditional,
          },
        ])
        // Сбрасываем ингредиенты
        setSelectedIngredients([])
      } else {
        // Для обычного продукта добавляем только один вариант без размера и типа
        setVariants([
          {
            price: variants.length > 0 ? variants[0].price : 0,
            size: null,
            pizzaType: null,
          },
        ])
        // Очищаем ингредиенты
        setSelectedIngredients([])
      }
    }
  }

  // Переключение выбора ингредиента
  const toggleIngredient = (ingredient: Ingredient) => {
    const isSelected = selectedIngredients.some((ing) => ing.id === ingredient.id)

    if (isSelected) {
      setSelectedIngredients(selectedIngredients.filter((ing) => ing.id !== ingredient.id))
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient])
    }
  }

  // Форматирование цены
  const formatPrice = (price: number) => {
    return price
  }

  // Получение названия размера пиццы
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

  // Получение названия типа пиццы
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <p className="text-gray-500">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-500 mb-4">Product not found</p>
        <Button asChild>
          <Link href="/admin/products">Back to Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/products" className="text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Тип продукта */}
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

            {/* Название продукта */}
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

            {/* URL изображения */}
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

            {/* Предпросмотр изображения */}
            <div className="mb-6">
              <p className="block text-sm font-medium text-gray-700 mb-2">Image Preview</p>
              <div className="h-40 w-40 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
                  alt={name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error'
                  }}
                />
              </div>
            </div>

            {/* Категория */}
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

            {/* Варианты продукта */}
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
                          {/* Размер пиццы */}
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

                          {/* Тип пиццы */}
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

                      {/* Цена */}
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

                      {/* Кнопка удаления */}
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

                    {/* Информация о варианте */}
                    {isPizza && (
                      <div className="mt-2 text-xs text-gray-500">
                        {getSizeName(variant.size)}, {getTypeName(variant.pizzaType)} - ${formatPrice(variant.price)}
                      </div>
                    )}
                  </div>
                ))}

                {variants.length === 0 && (
                  <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
                    <p className="text-gray-500">No variants added yet</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addVariant}
                      className="mt-2 flex items-center gap-1 mx-auto"
                    >
                      <Plus size={14} />
                      <span>Add Variant</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Ингредиенты (только для пиццы) */}
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
              <Button type="button" variant="outline" onClick={() => router.push('/admin/products')} disabled={saving}>
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
    </div>
  )
}
