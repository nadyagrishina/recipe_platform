package com.nadyagrishina.recipesplatform.service;

import com.nadyagrishina.recipesplatform.dto.response.FavoriteResponseDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeSummaryResponseDTO;

import java.util.List;

public interface FavoriteService {

    FavoriteResponseDTO addToFavorites(Long recipeId, String username);

    void removeFromFavorites(Long recipeId, String username);

    List<RecipeSummaryResponseDTO> getMyFavorites(String username);
}