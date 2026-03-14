package com.nadyagrishina.recipesplatform.service;

import com.nadyagrishina.recipesplatform.dto.request.RecipeRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeResponseDTO;

import java.util.List;

public interface RecipeService {

    List<RecipeResponseDTO> getAllRecipes();

    RecipeResponseDTO getRecipeById(Long id);

    List<RecipeResponseDTO> getMyRecipes(String email);

    RecipeResponseDTO createRecipe(RecipeRequestDTO request, String email);

    RecipeResponseDTO updateRecipe(Long id, RecipeRequestDTO request, String email);

    void deleteRecipe(Long id, String email);
}