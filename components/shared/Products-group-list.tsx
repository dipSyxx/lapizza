'use client'
import React from 'react'
import { useIntersection } from 'react-use'
import { Title } from './Title'
import { cn } from '@/lib/utils'
import { ProductCard, PropsProductCard } from './Product-card'
import { useCategoryStore } from '@/store/category'

interface Props {
  title: string
  items: PropsProductCard[]
  categoryId: number
  className?: string
  listClassName?: string
}

export const ProductsGroupList: React.FC<Props> = ({ title, items, listClassName, categoryId, className }) => {
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId)
  const intersectionRef = React.useRef<HTMLDivElement | null>(null)
  const intersection = useIntersection(intersectionRef as React.RefObject<HTMLElement>, {
    threshold: 0.4,
  })

  React.useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId)
    }
  }, [categoryId, intersection?.isIntersecting, title])

  return (
    <div className={className} id={title} ref={intersectionRef}>
      <Title text={title} size="lg" className="font-extrabold mb-5" />

      <div className={cn('grid grid-cols-3 gap-[50px]', listClassName)}>
        {items.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.imageUrl}
            price={product.items[0].price}
            items={product.items}
            // ingredients={product.ingredients}
          />
        ))}
      </div>
    </div>
  )
}
