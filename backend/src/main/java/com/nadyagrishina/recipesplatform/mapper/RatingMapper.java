package com.nadyagrishina.recipesplatform.mapper;

import com.nadyagrishina.recipesplatform.dto.request.RatingRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RatingResponseDTO;
import com.nadyagrishina.recipesplatform.entity.Rating;
import com.nadyagrishina.recipesplatform.entity.Recipe;
import com.nadyagrishina.recipesplatform.entity.User;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class RatingMapper {

    public Rating toEntity(RatingRequestDTO dto, User user, Recipe recipe) {
        return Rating.create(user, recipe, dto.getScore());
    }

    public RatingResponseDTO toResponseDTO(Rating rating) {
        if (rating == null) {
            return null;
        }

        return RatingResponseDTO.builder()
                .userId(rating.getUser().getId())
                .recipeId(rating.getRecipe().getId())
                .score(rating.getScore())
                .createdAt(rating.getCreatedAt())
                .build();
    }

    public List<RatingResponseDTO> toResponseDTOList(List<Rating> ratings) {
        if (ratings == null) {
            return Collections.emptyList();
        }

        return ratings.stream()
                .map(this::toResponseDTO)
                .toList();
    }
}