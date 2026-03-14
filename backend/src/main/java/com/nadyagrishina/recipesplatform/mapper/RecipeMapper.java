package com.nadyagrishina.recipesplatform.mapper;

import com.nadyagrishina.recipesplatform.dto.request.RecipeRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeResponseDTO;
import com.nadyagrishina.recipesplatform.entity.Recipe;
import org.springframework.stereotype.Component;

@Component
public class RecipeMapper {

    public Recipe toEntity(RecipeRequestDTO dto) {
        if (dto == null) return null;

        return Recipe.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .preparationTimeMinutes(dto.getPreparationTimeMinutes())
                .servings(dto.getServings())
                .build();
    }

    public RecipeResponseDTO toDto(Recipe entity) {
        if (entity == null) return null;

        return RecipeResponseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .preparationTimeMinutes(entity.getPreparationTimeMinutes())
                .servings(entity.getServings())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}