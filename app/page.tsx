import { Title, Container, TopBar, Filters, ProductsGroupList } from '@/components/shared'
import React, { Suspense } from 'react'

const Home: React.FC = () => {
  return (
    <>
      <Container className="mt-10">
        <div className="flex flex-col gap-5">
          <Title text="All pizzas" size="lg" className="font-extrabold" />
        </div>
      </Container>
      <TopBar />

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
              <ProductsGroupList
                key={1}
                title={'Pizzas'}
                categoryId={1}
                items={[
                  {
                    id: 1,
                    name: 'Cheesy chicken',
                    price: 30,
                    items: [{ price: 30 }],
                    imageUrl: 'https://media.dodostatic.net/image/r:292x292/11ee7d610e8bbb248f31270be742b4bd.avif',
                  },
                  {
                    id: 2,
                    name: 'Chesburger pizza',
                    price: 35,
                    items: [{ price: 35 }],
                    imageUrl: 'https://media.dodostatic.net/image/r:292x292/11ee7d610e8bbb248f31270be742b4bd.avif',
                  },
                  {
                    id: 3,
                    name: 'Bacon pizza',
                    price: 38,
                    items: [{ price: 38 }],
                    imageUrl: 'https://media.dodostatic.net/image/r:292x292/11ee7d610e8bbb248f31270be742b4bd.avif',
                  },
                ]}
              />

              <ProductsGroupList
                key={2}
                title={'Combo'}
                categoryId={2}
                items={[
                  {
                    id: 1,
                    name: 'Cheesy chicken',
                    price: 30,
                    items: [{ price: 30 }],
                    imageUrl: 'https://media.dodostatic.net/image/r:292x292/11ee7d610e8bbb248f31270be742b4bd.avif',
                  },
                  {
                    id: 2,
                    name: 'Chesburger pizza',
                    price: 35,
                    items: [{ price: 35 }],
                    imageUrl: 'https://media.dodostatic.net/image/r:292x292/11ee7d610e8bbb248f31270be742b4bd.avif',
                  },
                  {
                    id: 3,
                    name: 'Bacon pizza',
                    price: 38,
                    items: [{ price: 38 }],
                    imageUrl: 'https://media.dodostatic.net/image/r:292x292/11ee7d610e8bbb248f31270be742b4bd.avif',
                  },
                ]}
              />

              <ProductsGroupList
                key={3}
                title={'Snacks'}
                categoryId={3}
                items={[
                  {
                    id: 1,
                    name: 'Cheesy chicken',
                    price: 30,
                    items: [{ price: 30 }],
                    imageUrl: 'https://media.dodostatic.net/image/r:292x292/11ee7d610e8bbb248f31270be742b4bd.avif',
                  },
                  {
                    id: 2,
                    name: 'Chesburger pizza',
                    price: 35,
                    items: [{ price: 35 }],
                    imageUrl: 'https://media.dodostatic.net/image/r:292x292/11ee7d610e8bbb248f31270be742b4bd.avif',
                  },
                  {
                    id: 3,
                    name: 'Bacon pizza',
                    price: 38,
                    items: [{ price: 38 }],
                    imageUrl: 'https://media.dodostatic.net/image/r:292x292/11ee7d610e8bbb248f31270be742b4bd.avif',
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default Home
