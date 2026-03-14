package com.nadyagrishina.recipesplatform.service.impl;

import com.nadyagrishina.recipesplatform.dto.request.RecipeRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeResponseDTO;
import com.nadyagrishina.recipesplatform.entity.Recipe;
import com.nadyagrishina.recipesplatform.entity.User;
import com.nadyagrishina.recipesplatform.exception.ForbiddenException;
import com.nadyagrishina.recipesplatform.exception.NotFoundException;
import com.nadyagrishina.recipesplatform.exception.ConflictException;
import com.nadyagrishina.recipesplatform.mapper.RecipeMapper;
import com.nadyagrishina.recipesplatform.repository.RecipeRepository;
import com.nadyagrishina.recipesplatform.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final RecipeMapper recipeMapper;

    @Override
    public List<RecipeResponseDTO> getAllRecipes() {
        log.info("Fetching all recipes");
        return recipeRepository.findAll()
                .stream()
                .map(recipeMapper::toDto)
                .toList();
    }

    @Override
    public RecipeResponseDTO getRecipeById(Long id) {
        log.info("Fetching recipe {}", id);
        return recipeMapper.toDto(findRecipeById(id));
    }

    @Override
    public List<RecipeResponseDTO> getMyRecipes(String email) {
        log.info("Fetching recipes for current user {}", email);
        return recipeRepository.findAllByAuthorEmail(email)
                .stream()
                .map(recipeMapper::toDto)
                .toList();
    }

    @Transactional
    @Override
    public RecipeResponseDTO createRecipe(RecipeRequestDTO request, String email) {
        log.info("Creating recipe for user {}", email);

        User author = findUserByEmail(email);

        Recipe recipe = recipeMapper.toEntity(request);
        recipe.setAuthor(author);

        applyRecipeFields(recipe, request);

        Recipe savedRecipe = recipeRepository.save(recipe);
        return recipeMapper.toDto(savedRecipe);
    }

    @Transactional
    @Override
    public RecipeResponseDTO updateRecipe(Long id, RecipeRequestDTO request, String email) {
        log.info("Updating recipe {} for user {}", id, email);

        Recipe recipe = findRecipeById(id);
        validateOwnership(recipe, email);

        applyRecipeFields(recipe, request);

        Recipe updatedRecipe = recipeRepository.save(recipe);
        return recipeMapper.toDto(updatedRecipe);
    }

    @Transactional
    @Override
    public void deleteRecipe(Long id, String email) {
        log.info("Deleting recipe {} for user {}", id, email);

        Recipe recipe = findRecipeById(id);
        validateOwnership(recipe, email);

        recipeRepository.delete(recipe);
    }

    private Recipe findRecipeById(Long id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Recipe with id: " + id + " not found"));
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User with email: " + email + " not found"));
    }

    private void validateOwnership(Recipe recipe, String email) {
        if (!recipe.getAuthor().getEmail().equals(email)) {
            throw new ForbiddenException("You can modify only your own recipes.");
        }
    }

    private void applyRecipeFields(Recipe recipe, RecipeRequestDTO request) {
        recipe.setName(request.getName());
        recipe.setDescription(request.getDescription());
        recipe.setPreparationTimeMinutes(request.getPreparationTimeMinutes());
        recipe.setServings(request.getServings());
    }
}