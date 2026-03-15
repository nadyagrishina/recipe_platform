package com.nadyagrishina.recipesplatform.mapper;

import com.nadyagrishina.recipesplatform.dto.request.RecipeImageRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeImageResponseDTO;
import com.nadyagrishina.recipesplatform.entity.Recipe;
import com.nadyagrishina.recipesplatform.entity.RecipeImage;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class RecipeImageMapper {

    public RecipeImage toEntity(RecipeImageRequestDTO dto, Recipe recipe) {
        return RecipeImage.create(dto.getUrl(), recipe);
    }

    public List<RecipeImage> toEntityList(List<RecipeImageRequestDTO> dtos, Recipe recipe) {
        if (dtos == null) {
            return Collections.emptyList();
        }

        return dtos.stream()
                .map(dto -> toEntity(dto, recipe))
                .toList();
    }

    public RecipeImageResponseDTO toResponseDTO(RecipeImage image) {
        if (image == null) {
            return null;
        }

        return RecipeImageResponseDTO.builder()
                .id(image.getId())
                .url(image.getUrl())
                .createdAt(image.getCreatedAt())
                .updatedAt(image.getUpdatedAt())
                .build();
    }

    public List<RecipeImageResponseDTO> toResponseDTOList(List<RecipeImage> images) {
        if (images == null) {
            return Collections.emptyList();
        }

        return images.stream()
                .map(this::toResponseDTO)
                .toList();
    }
}