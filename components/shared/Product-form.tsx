'use client'

import React from 'react'
import { PizzaForm } from './Pizza-form'
import { ProductWithRelations } from './Products-group-list'
import { ChooseProductForm } from './Choose-product-form'
import { useCartStore } from '@/store/cart'
import toast from 'react-hot-toast'

interface Props {
  product: ProductWithRelations
  onSubmit?: VoidFunction
}

export const ProductForm: React.FC<Props> = ({ product, onSubmit: _onSubmit }) => {
  const firstItem = product.items?.[0]
  const isPizzaForm = firstItem ? Boolean(firstItem.pizzaType) : false

  const addCartItem = useCartStore((state) => state.addCartItem)
  const loading = useCartStore((state) => state.loading)

  const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
    try {
      const itemId = productItemId ?? firstItem.id

      await addCartItem({
        productItemId: itemId,
        ingredients,
      })

      toast.success(product.name + ' added to cart')

      _onSubmit?.()
    } catch (err) {
      toast.error('Failed to add product to cart')
      console.error(err)
    }
  }

  if (isPizzaForm) {
    return (
      <PizzaForm
        imageUrl={product.imageUrl}
        name={product.name}
        ingredients={product.ingredients}
        items={product.items}
        onSubmit={onSubmit}
        loading={loading}
      />
    )
  }

  return (
    <ChooseProductForm
      imageUrl={product.imageUrl}
      name={product.name}
      onSubmit={onSubmit}
      price={product.items[0].price}
      loading={loading}
    />
  )
}
