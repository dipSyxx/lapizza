import { useSearchParams } from "next/navigation"
import React from "react"
import { useSet } from "react-use"

interface PriceProps {
  priceFrom?: number
  priceTo?: number
}

interface QueryFilters extends PriceProps {
  ingredients: string
  sizes: string
  types: string
}

export interface Filters {
  sizes: Set<string>
  types: Set<string>
  selectedIngredients: Set<string>
  price: PriceProps
}

interface ReturnProps extends Filters{
  setPrice: (name: keyof PriceProps, value: number) => void
  setPizzaTypes: (value: string) => void
  setPizzaSizes: (value: string) => void
  setSelectedIngredients: (value: string) => void
}

export const useFilters = (): ReturnProps => {
  const searchParams = useSearchParams() as unknown as Map<keyof QueryFilters, string>

  // Filter Ingredients
  const [selectedIngredients, {toggle: toggleIngredients}] = useSet(new Set<string>(searchParams.get('ingredients')?.split(','),));

  // Filter Sizes
   const [sizes, { toggle: toggleSizes }] = useSet(
      new Set<string>(searchParams.get('sizes') ? searchParams.get('sizes')?.split(',') : []),
    )

    // Filter Types
    const [types, { toggle: toggleTypes }] = useSet(
      new Set<string>(searchParams.get('types') ? searchParams.get('types')?.split(',') : []),
    )

    // Filter Price
    const [price, setPrice] = React.useState<PriceProps>({
      priceFrom: Number(searchParams.get('priceFrom')) || undefined,
      priceTo: Number(searchParams.get('priceTo')) || undefined,
    })

    const updatePrice = (name: keyof PriceProps, value: number) => {
      setPrice((prev) => ({
        ...prev,
        [name]: value,
      }));
      }



      return React.useMemo(
        () => ({
          sizes,
          types,
          selectedIngredients,
          price,
          setPrice: updatePrice,
          setPizzaTypes: toggleTypes,
          setPizzaSizes: toggleSizes,
          setSelectedIngredients: toggleIngredients,
        }),
        [sizes, types, selectedIngredients, price],
      );

}
