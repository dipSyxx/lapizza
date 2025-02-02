'use client'
import React from 'react'
import { Title } from './Title'
import { Input } from '../ui'
import { RangeSlider } from './Range-slider'
import { CheckboxFilterGroup } from './Checkbox-filter-group'
import { useIngredients } from '@/hooks/useIngredients'
import { useFilters } from '@/hooks/useFilters'
import { useQueryFilters } from '@/hooks/useQueryFilters'

interface Props {
  className?: string
}

export const Filters: React.FC<Props> = ({ className }) => {
  const { ingredients, loading } = useIngredients()

  const filters = useFilters()

  useQueryFilters(filters)

  const items = ingredients.map((item) => ({ value: String(item.id), text: item.name }))

  const updatePrices = (price: number[]) => {
    filters.setPrice('priceFrom', price[0])
    filters.setPrice('priceTo', price[1])
  }

  return (
    <div className={className}>
      <Title text="Filters" size="sm" className="mb-5 font-bold" />

      {/* Top filters checkbox */}
      <div className="flex flex-col gap-4">
        <CheckboxFilterGroup
          title="Dough type"
          name="pizzaTypes"
          className="mb-5"
          selectedIds={filters.types}
          onClickCheckbox={filters.setPizzaTypes}
          items={[
            { text: 'Thin', value: '1' },
            { text: 'Traditional', value: '2' },
          ]}
        />

        <CheckboxFilterGroup
          title="Sizes"
          name="sizes"
          className="mb-5"
          selectedIds={filters.sizes}
          onClickCheckbox={filters.setPizzaSizes}
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
            value={String(filters.price.priceFrom)}
            onChange={(e) => filters.setPrice('priceFrom', Number(e.target.value))}
          />
          <Input
            type="number"
            min={10}
            max={150}
            placeholder="150"
            value={String(filters.price.priceTo)}
            onChange={(e) => filters.setPrice('priceTo', Number(e.target.value))}
          />
        </div>
        <RangeSlider
          min={0}
          max={150}
          step={1}
          value={[filters.price.priceFrom || 0, filters.price.priceTo || 150]}
          onValueChange={updatePrices}
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
        onClickCheckbox={filters.setSelectedIngredients}
        selectedIds={filters.selectedIngredients}
      />
    </div>
  )
}
