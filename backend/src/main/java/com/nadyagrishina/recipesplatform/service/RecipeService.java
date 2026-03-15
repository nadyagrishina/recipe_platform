package com.nadyagrishina.recipesplatform.service;

import com.nadyagrishina.recipesplatform.dto.request.RecipeCreateRequestDTO;
import com.nadyagrishina.recipesplatform.dto.request.RecipeUpdateRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeResponseDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeSummaryResponseDTO;

import java.util.List;

public interface RecipeService {

    RecipeResponseDTO createRecipe(RecipeCreateRequestDTO dto, String currentUsername);

    List<RecipeSummaryResponseDTO> getAllRecipes(String currentUsername);

    RecipeResponseDTO getRecipeById(Long id, String currentUsername);

    RecipeResponseDTO updateRecipe(Long recipeId, RecipeUpdateRequestDTO dto, String currentUsername);

    void deleteRecipe(Long recipeId, String currentUsername);

    List<RecipeSummaryResponseDTO> searchRecipes(String query, String currentUsername);
}