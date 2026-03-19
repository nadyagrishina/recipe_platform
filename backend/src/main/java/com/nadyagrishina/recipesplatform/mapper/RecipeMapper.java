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
                .preparationTimeMinutes(dto.getPreparationTimeMinutes())
                .servings(dto.getServings())
                .author(author)
                .category(category)
                .build();

        if (dto.getIngredients() != null) {
            dto.getIngredients().forEach(ingDto -> {
                Ingredient ingredient = ingredientMapper.toEntity(ingDto, recipe);
                recipe.addIngredient(ingredient);
            });
        }

        if (dto.getSteps() != null) {
            dto.getSteps().forEach(stepDto -> {
                RecipeStep step = recipeStepMapper.toEntity(stepDto, recipe);
                recipe.addStep(step);
            });
        }

        if (dto.getImages() != null) {
            dto.getImages().forEach(imgDto -> {
                RecipeImage image = recipeImageMapper.toEntity(imgDto, recipe);
                recipe.addImage(image);
            });
        }

        return recipe;
    }

    public void updateEntity(Recipe recipe, RecipeUpdateRequestDTO dto, Category category) {
        recipe.setName(dto.getName());
        recipe.setDescription(dto.getDescription());
        recipe.setPreparationTimeMinutes(dto.getPreparationTimeMinutes());
        recipe.setServings(dto.getServings());
        recipe.setCategory(category);

        if (dto.getIngredients() != null) {
            recipe.getIngredients().clear();
            ingredientMapper.toEntityList(dto.getIngredients(), recipe)
                    .forEach(recipe::addIngredient);
        }

        if (dto.getSteps() != null) {
            recipe.getSteps().clear();
            recipeStepMapper.toEntityList(dto.getSteps(), recipe)
                    .forEach(recipe::addStep);
        }

        if (dto.getImages() != null) {
            recipe.getImages().clear();
            recipeImageMapper.toEntityList(dto.getImages(), recipe)
                    .forEach(recipe::addImage);
        }
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