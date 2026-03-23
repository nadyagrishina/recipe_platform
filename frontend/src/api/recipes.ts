import api from "./axios";
import { 
  RecipeResponse, 
  RecipeSummaryDto, 
  PageRecipeSummaryResponse, 
  RecipeFormData 
} from "../types/api";

// export const getRecipes = (params: any) => 
//   api.get<PageRecipeSummaryResponse>("/api/recipes/search", { params });

export const getRecipeById = (id: number) => 
  api.get<RecipeResponse>(`/api/recipes/${id}`);

export const createRecipe = async (data: any) => {
  const res = await api.post<RecipeResponse>("/api/recipes", data);
  return res.data;
};

export const getCategories = () => 
  api.get("/api/categories");

export const getMyRecipes = (page = 0, size = 50) => 
  api.get<PageRecipeSummaryResponse>("/api/recipes/my", { params: { page, size } });

export const getFavoriteRecipes = () => 
  api.get<RecipeSummaryDto[]>("/api/users/me/favorites");

export const getMyRecipesCount = async (page = 0, size = 50) => {
  const res = await api.get<PageRecipeSummaryResponse>("/api/recipes/my", { params: { page, size } });
  return res.data;
};

export const getFavoriteRecipesCount = async () => {
  const res = await api.get<RecipeSummaryDto[]>("/api/users/me/favorites");
  return res.data;
};

export const generateShoppingList = (ids: number[]) => 
  api.post("/api/shopping-list/generate", ids);

export const addFavorite = (id: number) => 
  api.post(`/api/recipes/${id}/favorite`);

export const removeFavorite = (id: number) => 
  api.delete(`/api/recipes/${id}/favorite`);

export const deleteRecipe = (id: number) => api.delete(`/api/recipes/${id}`);
export const updateRecipe = (id: number, data: any) => api.put(`/api/recipes/${id}`, data);