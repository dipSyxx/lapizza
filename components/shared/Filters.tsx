'use client'
import React from 'react'
import { Title } from './Title'
import { Input } from '../ui'
import { RangeSlider } from './Range-slider'
import { CheckboxFilterGroup } from './Checkbox-filter-group'
import { useFilterIngredients } from '@/hooks/useFilterIngredients'
import { useSet } from 'react-use'

interface Props {
  className?: string
}

interface PriceProps {
  priceFrom: number
  priceTo: number
}

export const Filters: React.FC<Props> = ({ className }) => {
  const { ingredients, loading, onAddId, selectedIds } = useFilterIngredients()

  const [sizes, { toggle: toggleSizes }] = useSet(new Set<string>([]))
  const [types, { toggle: toggleTypes }] = useSet(new Set<string>([]))

  const [price, setPrice] = React.useState<PriceProps>({
    priceFrom: 0,
    priceTo: 150,
  })

  const updatePrice = (name: keyof PriceProps, value: number) => {
    setPrice({
      ...price,
      [name]: value,
    })
  }

  const items = ingredients.map((item) => ({ value: String(item.id), text: item.name }))

  return (
    <div className={className}>
      <Title text="Filters" size="sm" className="mb-5 font-bold" />

      {/* Top filters checkbox */}
      <div className="flex flex-col gap-4">
        <CheckboxFilterGroup
          title="Dough type"
          name="pizzaTypes"
          className="mb-5"
          selectedIds={sizes}
          onClickCheckbox={toggleSizes}
          items={[
            { text: 'Thin', value: '1' },
            { text: 'Traditional', value: '2' },
          ]}
        />

        <CheckboxFilterGroup
          title="Sizes"
          name="sizes"
          className="mb-5"
          selectedIds={types}
          onClickCheckbox={toggleTypes}
          items={[
            { text: '20 cm', value: '20' },
            { text: '30 cm', value: '30' },
            { text: '40 cm', value: '40' },
          ]}
        />
      </div>

      {/* filter price */}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Price from and to</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={150}
            value={String(price.priceFrom)}
            onChange={(e) => updatePrice('priceFrom', Number(e.target.value))}
          />
          <Input
            type="number"
            min={10}
            max={150}
            placeholder="150"
            value={String(price.priceTo)}
            onChange={(e) => updatePrice('priceTo', Number(e.target.value))}
          />
        </div>
        <RangeSlider
          min={0}
          max={150}
          step={1}
          value={[price.priceFrom, price.priceTo]}
          onValueChange={([from, to]) => setPrice({ priceFrom: from, priceTo: to })}
        />
      </div>

      <CheckboxFilterGroup
        name="ingredients"
        title="Ingridients"
        className="mt-5"
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items}
        loading={loading}
        onClickCheckbox={onAddId}
        selectedIds={selectedIds}
      />
    </div>
  )
}
