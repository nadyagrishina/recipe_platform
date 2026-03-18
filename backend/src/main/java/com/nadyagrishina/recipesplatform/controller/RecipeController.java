package com.nadyagrishina.recipesplatform.controller;

import com.nadyagrishina.recipesplatform.dto.request.RecipeCreateRequestDTO;
import com.nadyagrishina.recipesplatform.dto.request.RecipeUpdateRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeResponseDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeSummaryResponseDTO;
import com.nadyagrishina.recipesplatform.service.RecipeService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecipeResponseDTO createRecipe(@Valid @RequestBody RecipeCreateRequestDTO dto,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        return recipeService.createRecipe(dto, userDetails.getUsername());
    }

    @GetMapping
    public Page<RecipeSummaryResponseDTO> getAllRecipes(
            Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String currentUsername = userDetails != null ? userDetails.getUsername() : null;
        return recipeService.getAllRecipes(pageable, currentUsername);
    }

    @GetMapping("/{id}")
    public RecipeResponseDTO getRecipeById(@PathVariable Long id,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        String currentUsername = userDetails != null ? userDetails.getUsername() : null;
        return recipeService.getRecipeById(id, currentUsername);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public RecipeResponseDTO updateRecipe(@PathVariable Long id,
                                          @Valid @RequestBody RecipeUpdateRequestDTO dto,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        return recipeService.updateRecipe(id, dto, userDetails.getUsername());
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRecipe(@PathVariable Long id,
                             @AuthenticationPrincipal UserDetails userDetails) {
        recipeService.deleteRecipe(id, userDetails.getUsername());
    }

    @GetMapping("/search")
    public Page<RecipeSummaryResponseDTO> searchRecipes(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Integer maxTime,
            @RequestParam(required = false) Double minRating, // Новый параметр в URL
            Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails) {

        String currentUsername = userDetails != null ? userDetails.getUsername() : null;
        return recipeService.searchRecipes(query, categoryId, maxTime, minRating, pageable, currentUsername);
    }
}