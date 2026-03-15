package com.nadyagrishina.recipesplatform.mapper;

import com.nadyagrishina.recipesplatform.dto.request.IngredientRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.IngredientResponseDTO;
import com.nadyagrishina.recipesplatform.entity.Ingredient;
import com.nadyagrishina.recipesplatform.entity.Recipe;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class IngredientMapper {

    public Ingredient toEntity(IngredientRequestDTO dto, Recipe recipe) {
        return Ingredient.create(
                dto.getName(),
                dto.getAmount(),
                dto.getUnit(),
                recipe
        );
    }

    public List<Ingredient> toEntityList(List<IngredientRequestDTO> dtos, Recipe recipe) {
        if (dtos == null) {
            return Collections.emptyList();
        }

        return dtos.stream()
                .map(dto -> toEntity(dto, recipe))
                .toList();
    }

    public IngredientResponseDTO toResponseDTO(Ingredient ingredient) {
        if (ingredient == null) {
            return null;
        }

        return IngredientResponseDTO.builder()
                .id(ingredient.getId())
                .name(ingredient.getName())
                .amount(ingredient.getAmount())
                .unit(ingredient.getUnit())
                .createdAt(ingredient.getCreatedAt())
                .updatedAt(ingredient.getUpdatedAt())
                .build();
    }

    public List<IngredientResponseDTO> toResponseDTOList(List<Ingredient> ingredients) {
        if (ingredients == null) {
            return Collections.emptyList();
        }

        return ingredients.stream()
                .map(this::toResponseDTO)
                .toList();
    }
}