export type MeasurementUnit = "METRIC" | "IMPERIAL";

export interface UserSettingsDto {
  name?: string;
  surname?: string;
  description?: string;
  imageUrl?: string;
  measurementUnitSystem: MeasurementUnit;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  userSettingsDTO?: UserSettingsDto;
}

export type CombinedUser = UserDto & UserSettingsDto;

export interface RecipeSummaryDto {
  id: number;
  name: string;
  description: string;
  preparationTimeMinutes: number;
  servings: number;
  previewImageUrl?: string;
  averageRating: number;
  ratingsCount: number;
  favoritesCount: number;
  favorite: boolean;
  createdAt: string;
}

export interface PageRecipeSummaryResponse {
  content: RecipeSummaryDto[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface IngredientDto {
  id?: number;
  name: string;
  amount: number;
  unit: Unit;
}

export interface RecipeStepDto {
  id?: number;
  stepNumber: number;
  description: string;
}

export interface RecipeImageDto {
  id?: number;
  url: string;
}

export interface RecipeResponse {
  id: number;
  name: string;
  description: string;
  preparationTimeMinutes: number;
  servings: number;
  averageRating: number;
  ratingsCount: number;
  favoritesCount: number;
  favorite: boolean;
  author: any;
  category: { id: number; name: string };
  ingredients: IngredientDto[];
  steps: RecipeStepDto[];
  images: RecipeImageDto[];
  createdAt: string;
  updatedAt: string;
}

export type Unit = "GRAM" | "KILOGRAM" | "MILLILITER" | "LITER" | "TEASPOON" | "TABLESPOON" | "CUP" | "PIECE";

export interface IngredientFormItem {
  name: string;
  amount: string;
  unit: Unit | "";
}

export interface RecipeFormData {
  name: string;
  description: string;
  preparationTimeMinutes: number;
  servings: number;
  categoryId: number;
  ingredients: IngredientFormItem[];
  steps: { stepNumber: number; description: string }[];
  images: File[];
}