'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ProductWithRelations } from '../Products-group-list'
import { Dialog } from '@/components/ui'
import { cn } from '@/lib/utils'
import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { ProductForm } from '../Product-form'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface Props {
  product: ProductWithRelations
  className?: string
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter()

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent className={cn('p-0 w-[1060px] max-w-[1060px] min-h-[500px] bg-white overflow-hidden', className)}>
        <VisuallyHidden>
          <DialogTitle>Product</DialogTitle>
          <DialogDescription>Choose your product</DialogDescription>
        </VisuallyHidden>
        <ProductForm product={product} onSubmit={() => router.back()} />
      </DialogContent>
    </Dialog>
  )
}
