import { ChooseProductModal } from '@/components/shared/modals'
import { prisma } from '@/prisma/prisma-client'
import { notFound } from 'next/navigation'

export default async function ProductModalPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

  const product = await prisma.product.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      ingredients: true,
      items: true,
    },
  })

  if (!product) {
    return notFound()
  }

  return <ChooseProductModal product={product} />
}
