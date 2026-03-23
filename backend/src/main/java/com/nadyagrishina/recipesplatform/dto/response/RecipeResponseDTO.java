package com.nadyagrishina.recipesplatform.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Integer preparationTimeMinutes;
    private Integer servings;
    private UserResponseDTO author;
    private CategoryResponseDTO category;
    private List<IngredientResponseDTO> ingredients;
    private List<RecipeStepResponseDTO> steps;
    private List<RecipeImageResponseDTO> images;
    private List<CommentResponseDTO> comments;
    private List<RatingResponseDTO> ratings;
    private Double averageRating;
    private Integer ratingsCount;
    private Integer favoritesCount;
    private Boolean favorite;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}