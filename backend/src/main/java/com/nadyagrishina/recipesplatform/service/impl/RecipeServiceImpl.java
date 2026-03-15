package com.nadyagrishina.recipesplatform.service.impl;

import com.nadyagrishina.recipesplatform.dto.request.RecipeCreateRequestDTO;
import com.nadyagrishina.recipesplatform.dto.request.RecipeUpdateRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeResponseDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeSummaryResponseDTO;
import com.nadyagrishina.recipesplatform.entity.Category;
import com.nadyagrishina.recipesplatform.entity.Recipe;
import com.nadyagrishina.recipesplatform.entity.User;
import com.nadyagrishina.recipesplatform.exception.ResourceNotFoundException;
import com.nadyagrishina.recipesplatform.mapper.RecipeMapper;
import com.nadyagrishina.recipesplatform.repository.CategoryRepository;
import com.nadyagrishina.recipesplatform.repository.FavoriteRepository;
import com.nadyagrishina.recipesplatform.repository.RatingRepository;
import com.nadyagrishina.recipesplatform.repository.RecipeRepository;
import com.nadyagrishina.recipesplatform.repository.UserRepository;
import com.nadyagrishina.recipesplatform.service.RecipeService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FavoriteRepository favoriteRepository;
    private final RatingRepository ratingRepository;
    private final RecipeMapper recipeMapper;

    public RecipeServiceImpl(RecipeRepository recipeRepository,
                             UserRepository userRepository,
                             CategoryRepository categoryRepository,
                             FavoriteRepository favoriteRepository,
                             RatingRepository ratingRepository,
                             RecipeMapper recipeMapper) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.favoriteRepository = favoriteRepository;
        this.ratingRepository = ratingRepository;
        this.recipeMapper = recipeMapper;
    }

    @Override
    public RecipeResponseDTO createRecipe(RecipeCreateRequestDTO dto, String currentUsername) {
        User author = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + dto.getCategoryId()));

        Recipe recipe = recipeMapper.toEntity(dto, author, category);
        Recipe savedRecipe = recipeRepository.save(recipe);

        return recipeMapper.toResponseDTO(savedRecipe, 0.0, 0, false);
    }

    @Override
    public List<RecipeSummaryResponseDTO> getAllRecipes(String currentUsername) {
        Long currentUserId = getCurrentUserIdOrNull(currentUsername);

        return recipeRepository.findAll().stream()
                .map(recipe -> {
                    Double averageRating = ratingRepository.findAverageScoreByRecipeId(recipe.getId());
                    int favoritesCount = favoriteRepository.countByRecipeId(recipe.getId());
                    boolean favorite = currentUserId != null
                            && favoriteRepository.existsByUserIdAndRecipeId(currentUserId, recipe.getId());

                    return recipeMapper.toSummaryResponseDTO(
                            recipe,
                            averageRating != null ? averageRating : 0.0,
                            favoritesCount,
                            favorite
                    );
                })
                .toList();
    }

    @Override
    public RecipeResponseDTO getRecipeById(Long id, String currentUsername) {
        Recipe recipe = recipeRepository.findDetailedById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found: " + id));

        Double averageRating = ratingRepository.findAverageScoreByRecipeId(recipe.getId());
        int favoritesCount = favoriteRepository.countByRecipeId(recipe.getId());

        Long currentUserId = getCurrentUserIdOrNull(currentUsername);
        boolean favorite = currentUserId != null
                && favoriteRepository.existsByUserIdAndRecipeId(currentUserId, recipe.getId());

        return recipeMapper.toResponseDTO(
                recipe,
                averageRating != null ? averageRating : 0.0,
                favoritesCount,
                favorite
        );
    }

    @Override
    public RecipeResponseDTO updateRecipe(Long recipeId, RecipeUpdateRequestDTO dto, String currentUsername) {
        Recipe recipe = recipeRepository.findDetailedById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found: " + recipeId));

        if (!recipe.getAuthor().getUsername().equals(currentUsername)) {
            throw new IllegalArgumentException("You can update only your own recipes");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + dto.getCategoryId()));

        recipeMapper.updateEntity(recipe, dto, category);
        Recipe updatedRecipe = recipeRepository.save(recipe);

        Double averageRating = ratingRepository.findAverageScoreByRecipeId(updatedRecipe.getId());
        int favoritesCount = favoriteRepository.countByRecipeId(updatedRecipe.getId());

        Long currentUserId = getCurrentUserIdOrNull(currentUsername);
        boolean favorite = currentUserId != null
                && favoriteRepository.existsByUserIdAndRecipeId(currentUserId, updatedRecipe.getId());

        return recipeMapper.toResponseDTO(
                updatedRecipe,
                averageRating != null ? averageRating : 0.0,
                favoritesCount,
                favorite
        );
    }

    @Override
    public void deleteRecipe(Long recipeId, String currentUsername) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found: " + recipeId));

        if (!recipe.getAuthor().getUsername().equals(currentUsername)) {
            throw new IllegalArgumentException("You can delete only your own recipes");
        }

        recipeRepository.delete(recipe);
    }

    private Long getCurrentUserIdOrNull(String currentUsername) {
        if (currentUsername == null || currentUsername.isBlank()) {
            return null;
        }

        return userRepository.findByUsername(currentUsername)
                .map(User::getId)
                .orElse(null);
    }

    @Override
    public List<RecipeSummaryResponseDTO> searchRecipes(String query, String currentUsername) {
        Long currentUserId = getCurrentUserIdOrNull(currentUsername);

        return recipeRepository.searchByName(query).stream()
                .map(recipe -> {
                    Double averageRating = ratingRepository.findAverageScoreByRecipeId(recipe.getId());
                    int favoritesCount = favoriteRepository.countByRecipeId(recipe.getId());
                    boolean favorite = currentUserId != null
                            && favoriteRepository.existsByUserIdAndRecipeId(currentUserId, recipe.getId());

                    return recipeMapper.toSummaryResponseDTO(
                            recipe,
                            averageRating != null ? averageRating : 0.0,
                            favoritesCount,
                            favorite
                    );
                })
                .toList();
    }
}