export type RecipeApiResponse = {
  id: number;
  name: string;
  description: string;
  preparationTimeMinutes: number;
  servings: number;
  createdAt: string;
};

export type RecipeDetailApiResponse = {
  id: number;
  name: string;
  description: string;
  preparationTimeMinutes: number;
  servings: number;
  createdAt: string;
};


export type RecipeCardData = {
  id: number;
  title: string;
  imageUrl?: string;
  rating?: number;
  time?: number;
};

export type CreateRecipeRequest = {
  name: string;
  description: string;
  preparationTimeMinutes: number;
  servings: number;
};

export type RecipeFormData = {
  name: string;
  description: string;
  preparationTimeMinutes: number;
  servings: number;
  categoryId?: string;
  ingredients: IngredientFormItem[];
  steps: string[];
  images: File[];
};

export type Unit =
  | "GRAM"
  | "KILOGRAM"
  | "MILLILITER"
  | "LITER"
  | "TEASPOON"
  | "TABLESPOON"
  | "CUP"
  | "PIECE";

export type IngredientFormItem = {
  name: string;
  amount: string;
  unit: Unit | "";
};
