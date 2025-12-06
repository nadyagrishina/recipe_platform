package com.nadyagrishina.recipesplatform.service.impl;

import com.nadyagrishina.recipesplatform.dto.request.RecipeRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeResponseDTO;
import com.nadyagrishina.recipesplatform.exception.NotFoundException;
import com.nadyagrishina.recipesplatform.mapper.RecipeMapper;
import com.nadyagrishina.recipesplatform.model.Recipe;
import com.nadyagrishina.recipesplatform.repository.RecipeRepository;
import com.nadyagrishina.recipesplatform.service.RecipeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;
    private final RecipeMapper recipeMapper;

    @Override
    public List<RecipeResponseDTO> getAllRecipes() {
        log.info("Fetching all recipes.");
        return recipeRepository.findAll()
                .stream()
                .map(recipeMapper::toDto)
                .toList();
    }

    @Override
    public RecipeResponseDTO getRecipeById(Long id) {
        log.info("Fetching Recipe {}", id);
        return recipeMapper.toDto(findRecipeById(id));
    }

    @Transactional
    @Override
    public RecipeResponseDTO createRecipe(RecipeRequestDTO request) {
        log.info("Creating new Recipe {}", request.getName());
        Recipe recipe = recipeMapper.toEntity(request);
        Recipe savedRecipe = recipeRepository.save(recipe);
        return recipeMapper.toDto(savedRecipe);
    }

    @Transactional
    @Override
    public RecipeResponseDTO updateRecipe(Long id, RecipeRequestDTO request) {
        log.info("Updating recipe {}", id);
        Recipe recipe = findRecipeById(id);

        recipe.setName(request.getName());
        recipe.setDescription(request.getDescription());
        recipe.setImageUrls(request.getImageUrls());

        Recipe updatedRecipe = recipeRepository.save(recipe);
        return recipeMapper.toDto(updatedRecipe);
    }

    @Transactional
    @Override
    public void deleteRecipe(Long id) {
        log.info("Deleting recipe {}", id);
        recipeRepository.deleteById(id);
    }

    private Recipe findRecipeById(Long id){
        return recipeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Recipe with id: " + id + " not found."));
    }
}
