package com.nadyagrishina.recipesplatform.service;

import com.nadyagrishina.recipesplatform.dto.request.RatingRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RatingResponseDTO;

public interface RatingService {

    RatingResponseDTO rateRecipe(Long recipeId, RatingRequestDTO request, String username);

    void deleteRating(Long recipeId, String username);
}