package com.nadyagrishina.recipesplatform.controller;

import com.nadyagrishina.recipesplatform.dto.request.RecipeRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeResponseDTO;
import com.nadyagrishina.recipesplatform.service.RecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping
    public List<RecipeResponseDTO> getAllRecipes(){
        return recipeService.getAllRecipes();
    }

    @GetMapping("/{id}")
    public RecipeResponseDTO getRecipeById(@PathVariable Long id){
        return recipeService.getRecipeById(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public RecipeResponseDTO createRecipe(@RequestBody @Valid RecipeRequestDTO request){
        return recipeService.createRecipe(request);
    }

    @PutMapping("/{id}")
    public RecipeResponseDTO updateRecipe(@PathVariable Long id, @RequestBody @Valid RecipeRequestDTO request){
        return recipeService.updateRecipe(id, request);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void deleteRecipe(@PathVariable Long id){
        recipeService.deleteRecipe(id);
    }
}
