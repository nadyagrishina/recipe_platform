package com.nadyagrishina.recipesplatform.service.impl;

import com.nadyagrishina.recipesplatform.dto.response.FavoriteResponseDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeSummaryResponseDTO;
import com.nadyagrishina.recipesplatform.entity.Favorite;
import com.nadyagrishina.recipesplatform.entity.Recipe;
import com.nadyagrishina.recipesplatform.entity.User;
import com.nadyagrishina.recipesplatform.exception.ConflictException;
import com.nadyagrishina.recipesplatform.exception.ResourceNotFoundException;
import com.nadyagrishina.recipesplatform.mapper.FavoriteMapper;
import com.nadyagrishina.recipesplatform.mapper.RecipeMapper;
import com.nadyagrishina.recipesplatform.repository.FavoriteRepository;
import com.nadyagrishina.recipesplatform.repository.RatingRepository;
import com.nadyagrishina.recipesplatform.repository.RecipeRepository;
import com.nadyagrishina.recipesplatform.repository.UserRepository;
import com.nadyagrishina.recipesplatform.service.FavoriteService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final FavoriteMapper favoriteMapper;
    private final RecipeMapper recipeMapper;

    @Override
    public FavoriteResponseDTO addToFavorites(Long recipeId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found: " + recipeId));

        if (favoriteRepository.existsByUserIdAndRecipeId(user.getId(), recipeId)) {
            throw new ConflictException("Recipe is already in favorites");
        }

        Favorite favorite = favoriteMapper.toEntity(user, recipe);
        Favorite saved = favoriteRepository.save(favorite);

        return favoriteMapper.toResponseDTO(saved);
    }

    @Override
    public void removeFromFavorites(Long recipeId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Favorite favorite = favoriteRepository.findByUserIdAndRecipeId(user.getId(), recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found for recipe: " + recipeId));

        favoriteRepository.delete(favorite);
    }

    @Override
    public List<RecipeSummaryResponseDTO> getMyFavorites(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        return favoriteRepository.findByUserId(user.getId()).stream()
                .map(Favorite::getRecipe)
                .map(recipe -> {
                    Double averageRating = ratingRepository.findAverageScoreByRecipeId(recipe.getId());
                    int favoritesCount = favoriteRepository.countByRecipeId(recipe.getId());

                    return recipeMapper.toSummaryResponseDTO(
                            recipe,
                            averageRating != null ? averageRating : 0.0,
                            favoritesCount,
                            true
                    );
                })
                .toList();
    }
}