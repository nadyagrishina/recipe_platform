package com.nadyagrishina.recipesplatform.mapper;

import com.nadyagrishina.recipesplatform.dto.request.RecipeRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeResponseDTO;
import com.nadyagrishina.recipesplatform.model.Recipe;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RecipeMapper {
    //DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "imageUrls", defaultExpression = "java(new java.util.ArrayList<>())")
    Recipe toEntity(RecipeRequestDTO dto);

    //Entity -> DTO
    RecipeResponseDTO toDto(Recipe entity);
}
