/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'
import { Title } from './Title'
import { Button } from '../ui'
import { Plus } from 'lucide-react'
import { Ingredient } from '@prisma/client'

export interface PropsProductCard {
  id: number
  name: string
  price: number
  imageUrl: string
  ingredients: Ingredient[]
  className?: string
}

export const ProductCard: React.FC<PropsProductCard> = ({ id, name, price, imageUrl, ingredients, className }) => {
  return (
    <div className={className}>
      <Link href={`/product/${id}`}>
        <div className="flex justify-center p-6 bg-primary/10 rounded-lg h-[260px]">
          <img className="w-[215px] h-[215px]" src={imageUrl} alt="pizza" />
        </div>

        <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />

        <p className="text-sm text-gray-400">{ingredients.map((ingredient) => ingredient.name).join(', ')}</p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-[20px]">
            from <b>{price}$</b>
          </span>

          <Button variant="outline" className="text-base font-bold border-0 bg-primary/10 hover:bg-primary/20">
            <Plus size={20} className="mr-1" />
            Add
          </Button>
        </div>
      </Link>
    </div>
  )
}
