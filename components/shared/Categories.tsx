'use client'
import { cn } from '@/lib/utils'
import { useCategoryStore } from '@/store/category'
import { Category } from '@prisma/client'
import React from 'react'

interface Props {
  items: Category[]
  className?: string
}

export const Categories: React.FC<Props> = ({ items, className }) => {
  const activeCategoryId = useCategoryStore((state) => state.activeId)

  return (
    <div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-xl', className)}>
      {items.map(({ name, id }) => (
        <a
          className={cn(
            'flex items-center font-bold h-11 rounded-xl px-5 cursor-pointer',
            activeCategoryId === id && 'bg-white shadow-md shadow-gray-200 text-primary',
          )}
          key={id}
          href={`/#${name}`}
        >
          {name}
        </a>
      ))}
    </div>
  )
}
