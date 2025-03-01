import { Container, ProductForm } from '@/components/shared'
import { prisma } from '@/prisma/prisma-client'
import { notFound } from 'next/navigation'
import React from 'react'

const ProductPage = async (props: { params: { id: string } }) => {
  const { id } = props.params

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
