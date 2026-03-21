package com.nadyagrishina.recipesplatform.service.impl;

import com.nadyagrishina.recipesplatform.dto.response.CategoryResponseDTO;
import com.nadyagrishina.recipesplatform.repository.CategoryRepository;
import com.nadyagrishina.recipesplatform.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> CategoryResponseDTO.builder()
                        .id(category.getId())
                        .code(category.getCode())
                        .build())
                .toList();
    }
}