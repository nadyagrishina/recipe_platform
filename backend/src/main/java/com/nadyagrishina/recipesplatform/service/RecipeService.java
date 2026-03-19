package com.nadyagrishina.recipesplatform.service;

import com.nadyagrishina.recipesplatform.dto.request.RecipeCreateRequestDTO;
import com.nadyagrishina.recipesplatform.dto.request.RecipeUpdateRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeResponseDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeSummaryResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecipeService {

    RecipeResponseDTO createRecipe(RecipeCreateRequestDTO dto, String currentUsername);

    Page<RecipeSummaryResponseDTO> getAllRecipes(Pageable pageable, String currentUsername);

    RecipeResponseDTO getRecipeById(Long id, String currentUsername);

    RecipeResponseDTO updateRecipe(Long recipeId, RecipeUpdateRequestDTO dto, String currentUsername);

    void deleteRecipe(Long recipeId, String currentUsername);

    Page<RecipeSummaryResponseDTO> searchRecipes(String query, Long categoryId, Integer maxTime, Double minRating, Pageable pageable, String currentUsername);

    Page<RecipeSummaryResponseDTO> getMyRecipes(Pageable pageable, String username);
}