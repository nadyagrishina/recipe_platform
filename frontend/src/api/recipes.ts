import api from "./axios";

export const getRecipes = (params: any) => 
  api.get("/api/recipes/search", { params });

export const getRecipeById = (id: number) => 
  api.get(`/api/recipes/${id}`);

export const createRecipe = (data: any) => 
  api.post("/api/recipes", data);

export const getCategories = () => 
  api.get("/api/categories");

export const getMyRecipes = (page = 0, size = 50) => 
  api.get("/api/recipes/my", { params: { page, size } });

export const getFavoriteRecipes = () => 
  api.get("/api/users/me/favorites");

export const generateShoppingList = (ids: number[]) => 
  api.post("/api/shopping-list/generate", ids);

export const toggleFavorite = (id: number) => 
  api.post(`/api/recipes/${id}/favorite`);

export const addFavorite = (id: number) => api.post(`/api/recipes/${id}/favorite`);
export const removeFavorite = (id: number) => api.delete(`/api/recipes/${id}/favorite`);