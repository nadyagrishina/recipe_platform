export type RecipeCardData = {
  id: number;
  title: string;
  imageUrl?: string;
  rating?: number;
  time?: number;
};

export type RecipeFormData = {
  name: string;
  description: string;
  preparationTimeMinutes: number;
  servings: number;
  categoryId: string;
  ingredients: string[];
  steps: string[];
  images: File[];
};
