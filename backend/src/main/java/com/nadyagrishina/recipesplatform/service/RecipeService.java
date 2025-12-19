package com.nadyagrishina.recipesplatform.service;

import com.nadyagrishina.recipesplatform.dto.request.RecipeRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeResponseDTO;

import java.util.List;

public interface RecipeService {
    List<RecipeResponseDTO> getAllRecipes();
    RecipeResponseDTO getRecipeById(Long id);
    RecipeResponseDTO createRecipe(RecipeRequestDTO request);
    RecipeResponseDTO updateRecipe(Long id, RecipeRequestDTO request);
    void deleteRecipe(Long id);
}
