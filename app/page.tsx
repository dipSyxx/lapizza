import { Title, Container, TopBar, Filters, ProductsGroupList } from '@/components/shared'
import { findPizzas, GetSearchParams } from '@/lib/findPizzas'
import React, { Suspense } from 'react'

export default async function Home(props: { searchParams: Promise<GetSearchParams> }) {
  const searchParams = await props.searchParams
  const categories = await findPizzas(searchParams)

  return (
    <>
      <Container className="mt-10">
        <div className="flex flex-col gap-5">
          <Title text="All pizzas" size="lg" className="font-extrabold" />
        </div>
      </Container>
      <TopBar categories={categories} />

      <Container className="mt-10 pb-14">
        <div className="flex gap-[60px]">
          {/* filters */}
          <div className="w-[250px]">
            <Suspense>
              <Filters />
            </Suspense>
          </div>

          {/* list of products */}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categories.map(
                (category) =>
                  category.products.length > 0 && (
                    <ProductsGroupList
                      key={category.id}
                      title={category.name}
                      categoryId={category.id}
                      items={category.products}
                    />
                  ),
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
