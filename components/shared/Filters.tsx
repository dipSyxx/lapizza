import React from 'react'
import { Title } from './Title'
import { FilterCheckbox } from './Filter-checkbox'
import { Input } from '../ui'
import { RangeSlider } from './Range-slider'
import { CheckboxFilterGroup } from './Checkbox-filter-group'

interface Props {
  className?: string
}

export const Filters: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Title text="Filters" size="sm" className="mb-5 font-bold" />

      {/* Top filters checkbox */}
      <div className="flex flex-col gap-4">
        <FilterCheckbox text="Can be collected" value="1" name="collect" key={1} />
        <FilterCheckbox text="New items" value="2" name="new" key={2} />
      </div>

      {/* filter price */}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Price from and to</p>
        <div className="flex gap-3 mb-5">
          <Input type="number" placeholder="0" min={0} max={150} defaultValue={0} />
          <Input type="number" min={10} max={150} placeholder="150" />
        </div>
        <RangeSlider min={0} max={150} step={1} />
      </div>

      <CheckboxFilterGroup
        title="Ingridients"
        className="mt-5"
        limit={6}
        defaultItems={[
          {
            text: 'Cheese sauce',
            value: '1',
            name: 'cheese-sauce',
          },
          {
            text: 'Mozzarella',
            value: '2',
            name: 'mozzarella',
          },
          {
            text: 'Garlic',
            value: '3',
            name: 'garlic',
          },
          {
            text: 'Salt cucumbers',
            value: '4',
            name: 'salt-cucumbers',
          },
          {
            text: 'Red onion',
            value: '5',
            name: 'red-onion',
          },
          {
            text: 'Tomatoes',
            value: '6',
            name: 'tomatoes',
          },
        ]}
        items={[
          {
            text: 'Cheese sauce',
            value: '1',
            name: 'cheese-sauce',
          },
          {
            text: 'Mozzarella',
            value: '2',
            name: 'mozzarella',
          },
          {
            text: 'Garlic',
            value: '3',
            name: 'garlic',
          },
          {
            text: 'Salt cucumbers',
            value: '4',
            name: 'salt-cucumbers',
          },
          {
            text: 'Red onion',
            value: '5',
            name: 'red-onion',
          },
          {
            text: 'Tomatoes',
            value: '6',
            name: 'tomatoes',
          },
          {
            text: 'Cheese sauce',
            value: '1',
            name: 'cheese-sauce',
          },
          {
            text: 'Mozzarella',
            value: '2',
            name: 'mozzarella',
          },
          {
            text: 'Garlic',
            value: '3',
            name: 'garlic',
          },
          {
            text: 'Salt cucumbers',
            value: '4',
            name: 'salt-cucumbers',
          },
          {
            text: 'Red onion',
            value: '5',
            name: 'red-onion',
          },
          {
            text: 'Tomatoes',
            value: '6',
            name: 'tomatoes',
          },
        ]}
      />
    </div>
  )
}
