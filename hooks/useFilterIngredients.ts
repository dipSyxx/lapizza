'use client'

import React from "react";
import { Ingredient } from "@prisma/client";
import { Api } from "@/services/api-client";
import { useSet } from "react-use";

interface FilterIngredientsProps {
  ingredients: Ingredient[];
  loading: boolean;
  selectedIds: Set<string>;
  onAddId: (id: string) => void;
}


export const useFilterIngredients = (): FilterIngredientsProps => {
  const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [selectedIds, {toggle}] = useSet(new Set<string>([]));

 React.useEffect(() => {
  async function fetchIngredients() {
    try {
      setLoading(true);
      const ingredients = await Api.ingredients.getAllIngredients();
      setIngredients(ingredients);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  fetchIngredients()
 }, [])

 return {
  ingredients,
  loading,
  onAddId: toggle, selectedIds
};

};
