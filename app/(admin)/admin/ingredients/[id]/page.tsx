'use client'

import React, { useState, useEffect, use } from 'react'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Ingredient } from '@prisma/client'
import { Api } from '@/services/api-client'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { IngredientAdminForm } from '@/components/shared/form/IngredientAdminForm'

export default function EditIngredientPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const ingredientId = resolvedParams.id
  const router = useRouter()

  const [ingredient, setIngredient] = useState<Ingredient | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        setLoading(true)
        const response = await Api.adminIngredients.getAdminIngredientById(ingredientId)
        setIngredient(response)
      } catch (error) {
        console.error('Error fetching ingredient:', error)
        toast.error('Failed to load ingredient')
        router.push('/admin/ingredients')
      } finally {
        setLoading(false)
      }
    }
    fetchIngredient()
  }, [ingredientId, router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <p className="text-gray-500">Loading ingredient...</p>
      </div>
    )
  }

  if (!ingredient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-500 mb-4">Ingredient not found</p>
        <Button asChild>
          <Link href="/admin/ingredients">Back to Ingredients</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/ingredients" className="text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold">Edit Ingredient</h1>
      </div>

      <IngredientAdminForm ingredient={ingredient} onSave={() => {}} />
    </div>
  )
}
