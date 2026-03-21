package com.nadyagrishina.recipesplatform.mapper;

import com.nadyagrishina.recipesplatform.dto.request.CategoryRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.CategoryResponseDTO;
import com.nadyagrishina.recipesplatform.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public Category toEntity(CategoryRequestDTO dto) {
        Category category = new Category();
        category.setCode(dto.getCode());
        return category;
    }

    public CategoryResponseDTO toResponseDTO(Category category) {
        if (category == null) {
            return null;
        }

        return CategoryResponseDTO.builder()
                .id(category.getId())
                .code(category.getCode())
                .build();
    }
}