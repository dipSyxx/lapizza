'use client'

import React from 'react'
import { PizzaForm } from './Pizza-form'
import { ProductWithRelations } from './Products-group-list'
import { ChooseProductForm } from './Choose-product-form'

interface Props {
  product: ProductWithRelations
  onSubmit?: VoidFunction
}

export const ProductForm: React.FC<Props> = ({ product }) => {
  const firstItem = product.items?.[0]
  const isPizzaForm = firstItem ? Boolean(firstItem.pizzaType) : false

  if (isPizzaForm) {
    return (
      <PizzaForm
        imageUrl={product.imageUrl}
        name={product.name}
        ingredients={product.ingredients}
        items={product.items}
        // onSubmit={onSubmit}
        // loading={loading}
      />
    )
  }

  return (
    <ChooseProductForm
      imageUrl={product.imageUrl}
      name={product.name}
      // onSubmit={onSubmit}
      price={firstItem?.price ?? 0}
      // loading={loading}
    />
  )
}
