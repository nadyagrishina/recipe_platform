package com.nadyagrishina.recipesplatform.controller;

import com.nadyagrishina.recipesplatform.dto.response.CategoryResponseDTO;
import com.nadyagrishina.recipesplatform.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryService.getAllCategories();
    }
}