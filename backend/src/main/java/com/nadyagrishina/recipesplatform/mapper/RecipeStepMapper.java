package com.nadyagrishina.recipesplatform.mapper;

import com.nadyagrishina.recipesplatform.dto.request.RecipeStepRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeStepResponseDTO;
import com.nadyagrishina.recipesplatform.entity.Recipe;
import com.nadyagrishina.recipesplatform.entity.RecipeStep;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class RecipeStepMapper {

    public RecipeStep toEntity(RecipeStepRequestDTO dto, Recipe recipe) {
        return RecipeStep.create(
                dto.getStepNumber(),
                dto.getDescription(),
                recipe
        );
    }

    public List<RecipeStep> toEntityList(List<RecipeStepRequestDTO> dtos, Recipe recipe) {
        if (dtos == null) {
            return Collections.emptyList();
        }

        return dtos.stream()
                .map(dto -> toEntity(dto, recipe))
                .toList();
    }

    public RecipeStepResponseDTO toResponseDTO(RecipeStep step) {
        if (step == null) {
            return null;
        }

        return RecipeStepResponseDTO.builder()
                .id(step.getId())
                .stepNumber(step.getStepNumber())
                .description(step.getDescription())
                .createdAt(step.getCreatedAt())
                .updatedAt(step.getUpdatedAt())
                .build();
    }

    public List<RecipeStepResponseDTO> toResponseDTOList(List<RecipeStep> steps) {
        if (steps == null) {
            return Collections.emptyList();
        }

        return steps.stream()
                .map(this::toResponseDTO)
                .toList();
    }
}