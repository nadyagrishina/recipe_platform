package com.nadyagrishina.recipesplatform.service;

import com.nadyagrishina.recipesplatform.dto.response.CategoryResponseDTO;
import java.util.List;

public interface CategoryService {
    List<CategoryResponseDTO> getAllCategories();
}