import { Container, ProductForm } from '@/components/shared'
import { prisma } from '@/prisma/prisma-client'
import { notFound } from 'next/navigation'
import React from 'react'

interface ProductPageProps {
  params: { id: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = params

  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      ingredients: true,
      category: {
        include: {
          products: {
            include: {
              items: true,
            },
          },
        },
      },
      items: true,
    },
  })

  if (!product) {
    return notFound()
  }

  return (
    <Container className="flex flex-col my-10">
      <ProductForm product={product} />
    </Container>
  )
}

export default ProductPage
