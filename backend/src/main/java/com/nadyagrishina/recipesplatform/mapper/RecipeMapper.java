package com.nadyagrishina.recipesplatform.mapper;

import com.nadyagrishina.recipesplatform.dto.request.RecipeCreateRequestDTO;
import com.nadyagrishina.recipesplatform.dto.request.RecipeUpdateRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeResponseDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeSummaryResponseDTO;
import com.nadyagrishina.recipesplatform.entity.*;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class RecipeMapper {

    private final UserMapper userMapper;
    private final CategoryMapper categoryMapper;
    private final IngredientMapper ingredientMapper;
    private final RecipeStepMapper recipeStepMapper;
    private final RecipeImageMapper recipeImageMapper;
    private final CommentMapper commentMapper;
    private final RatingMapper ratingMapper;

    public RecipeMapper(UserMapper userMapper,
                        CategoryMapper categoryMapper,
                        IngredientMapper ingredientMapper,
                        RecipeStepMapper recipeStepMapper,
                        RecipeImageMapper recipeImageMapper,
                        CommentMapper commentMapper,
                        RatingMapper ratingMapper) {
        this.userMapper = userMapper;
        this.categoryMapper = categoryMapper;
        this.ingredientMapper = ingredientMapper;
        this.recipeStepMapper = recipeStepMapper;
        this.recipeImageMapper = recipeImageMapper;
        this.commentMapper = commentMapper;
        this.ratingMapper = ratingMapper;
    }

    public Recipe toEntity(RecipeCreateRequestDTO dto, User author, Category category) {
        Recipe recipe = Recipe.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .author(author)
                .preparationTimeMinutes(dto.getPreparationTimeMinutes())
                .servings(dto.getServings())
                .category(category)
                .build();

        List<Ingredient> ingredients = ingredientMapper.toEntityList(dto.getIngredients(), recipe);
        List<RecipeStep> steps = recipeStepMapper.toEntityList(dto.getSteps(), recipe);
        List<RecipeImage> images = recipeImageMapper.toEntityList(dto.getImages(), recipe);

        recipe.getIngredients().addAll(ingredients);
        recipe.getSteps().addAll(steps);
        recipe.getImages().addAll(images);

        return recipe;
    }

    public void updateEntity(Recipe recipe, RecipeUpdateRequestDTO dto, Category category) {
        recipe.setName(dto.getName());
        recipe.setDescription(dto.getDescription());
        recipe.setPreparationTimeMinutes(dto.getPreparationTimeMinutes());
        recipe.setServings(dto.getServings());
        recipe.setCategory(category);

        recipe.getIngredients().clear();
        recipe.getIngredients().addAll(
                ingredientMapper.toEntityList(dto.getIngredients(), recipe)
        );

        recipe.getSteps().clear();
        recipe.getSteps().addAll(
                recipeStepMapper.toEntityList(dto.getSteps(), recipe)
        );

        recipe.getImages().clear();
        recipe.getImages().addAll(
                recipeImageMapper.toEntityList(dto.getImages(), recipe)
        );
    }

    public RecipeResponseDTO toResponseDTO(Recipe recipe) {
        return toResponseDTO(recipe, null, null, null);
    }

    public RecipeResponseDTO toResponseDTO(Recipe recipe,
                                           Double averageRating,
                                           Integer favoritesCount,
                                           Boolean favorite) {
        if (recipe == null) {
            return null;
        }

        List<Rating> ratings = safe(recipe.getRatings());
        List<Favorite> favorites = safe(recipe.getFavorites());

        double computedAverageRating = ratings.isEmpty()
                ? 0.0
                : ratings.stream()
                .mapToInt(Rating::getScore)
                .average()
                .orElse(0.0);

        int computedFavoritesCount = favorites.size();

        return RecipeResponseDTO.builder()
                .id(recipe.getId())
                .name(recipe.getName())
                .description(recipe.getDescription())
                .preparationTimeMinutes(recipe.getPreparationTimeMinutes())
                .servings(recipe.getServings())
                .author(userMapper.toResponseDTO(recipe.getAuthor()))
                .category(categoryMapper.toResponseDTO(recipe.getCategory()))
                .ingredients(ingredientMapper.toResponseDTOList(recipe.getIngredients()))
                .steps(recipeStepMapper.toResponseDTOList(recipe.getSteps()))
                .images(recipeImageMapper.toResponseDTOList(recipe.getImages()))
                .comments(commentMapper.toResponseDTOList(recipe.getComments()))
                .ratings(ratingMapper.toResponseDTOList(ratings))
                .averageRating(averageRating != null ? averageRating : computedAverageRating)
                .ratingsCount(ratings.size())
                .favoritesCount(favoritesCount != null ? favoritesCount : computedFavoritesCount)
                .favorite(favorite != null ? favorite : Boolean.FALSE)
                .createdAt(recipe.getCreatedAt())
                .updatedAt(recipe.getUpdatedAt())
                .build();
    }

    public RecipeSummaryResponseDTO toSummaryResponseDTO(Recipe recipe) {
        return toSummaryResponseDTO(recipe, null, null, null);
    }

    public RecipeSummaryResponseDTO toSummaryResponseDTO(Recipe recipe,
                                                         Double averageRating,
                                                         Integer favoritesCount,
                                                         Boolean favorite) {
        if (recipe == null) {
            return null;
        }

        List<Rating> ratings = safe(recipe.getRatings());
        List<Favorite> favorites = safe(recipe.getFavorites());

        double computedAverageRating = ratings.isEmpty()
                ? 0.0
                : ratings.stream()
                .mapToInt(Rating::getScore)
                .average()
                .orElse(0.0);

        int computedFavoritesCount = favorites.size();

        String previewImageUrl = recipe.getImages() != null && !recipe.getImages().isEmpty()
                ? recipe.getImages().get(0).getUrl()
                : null;

        return RecipeSummaryResponseDTO.builder()
                .id(recipe.getId())
                .name(recipe.getName())
                .description(recipe.getDescription())
                .preparationTimeMinutes(recipe.getPreparationTimeMinutes())
                .servings(recipe.getServings())
                .author(userMapper.toResponseDTO(recipe.getAuthor()))
                .category(categoryMapper.toResponseDTO(recipe.getCategory()))
                .previewImageUrl(previewImageUrl)
                .averageRating(averageRating != null ? averageRating : computedAverageRating)
                .ratingsCount(ratings.size())
                .favoritesCount(favoritesCount != null ? favoritesCount : computedFavoritesCount)
                .favorite(favorite != null ? favorite : Boolean.FALSE)
                .createdAt(recipe.getCreatedAt())
                .build();
    }

    public List<RecipeSummaryResponseDTO> toSummaryResponseDTOList(List<Recipe> recipes) {
        if (recipes == null) {
            return Collections.emptyList();
        }

        return recipes.stream()
                .map(this::toSummaryResponseDTO)
                .toList();
    }

    private <T> List<T> safe(List<T> list) {
        return list == null ? Collections.emptyList() : list;
    }
}