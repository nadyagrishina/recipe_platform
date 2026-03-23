package com.nadyagrishina.recipesplatform.service.impl;

import com.nadyagrishina.recipesplatform.dto.request.RecipeCreateRequestDTO;
import com.nadyagrishina.recipesplatform.dto.request.RecipeUpdateRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeImageResponseDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeResponseDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeSummaryResponseDTO;
import com.nadyagrishina.recipesplatform.entity.Category;
import com.nadyagrishina.recipesplatform.entity.Recipe;
import com.nadyagrishina.recipesplatform.entity.User;
import com.nadyagrishina.recipesplatform.entity.RecipeImage;
import com.nadyagrishina.recipesplatform.exception.ResourceNotFoundException;
import com.nadyagrishina.recipesplatform.mapper.IngredientMapper;
import com.nadyagrishina.recipesplatform.mapper.RecipeImageMapper;
import com.nadyagrishina.recipesplatform.mapper.RecipeMapper;
import com.nadyagrishina.recipesplatform.mapper.RecipeStepMapper;
import com.nadyagrishina.recipesplatform.repository.CategoryRepository;
import com.nadyagrishina.recipesplatform.repository.FavoriteRepository;
import com.nadyagrishina.recipesplatform.repository.RatingRepository;
import com.nadyagrishina.recipesplatform.repository.RecipeRepository;
import com.nadyagrishina.recipesplatform.repository.UserRepository;
import com.nadyagrishina.recipesplatform.service.RecipeService;
import com.nadyagrishina.recipesplatform.specification.RecipeSpecifications;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
@Transactional
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FavoriteRepository favoriteRepository;
    private final RatingRepository ratingRepository;
    private final RecipeMapper recipeMapper;
    private final RecipeImageMapper recipeImageMapper;
    private final RecipeStepMapper recipeStepMapper;
    private final IngredientMapper ingredientMapper;

    public RecipeServiceImpl(
            RecipeRepository recipeRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            FavoriteRepository favoriteRepository,
            RatingRepository ratingRepository,
            RecipeMapper recipeMapper,
            RecipeImageMapper recipeImageMapper,
            RecipeStepMapper recipeStepMapper,
            IngredientMapper ingredientMapper) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.favoriteRepository = favoriteRepository;
        this.ratingRepository = ratingRepository;
        this.recipeMapper = recipeMapper;
        this.recipeImageMapper = recipeImageMapper;
        this.recipeStepMapper = recipeStepMapper;
        this.ingredientMapper = ingredientMapper;
    }

    @Override
    public RecipeResponseDTO createRecipe(RecipeCreateRequestDTO dto, String currentUsername) {
        User author = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + dto.getCategoryId()));

        Recipe recipe = recipeMapper.toEntity(dto, author, category);
        Recipe savedRecipe = recipeRepository.save(recipe);

        return recipeMapper.toResponseDTO(savedRecipe, 0.0, 0, false);
    }

    @Override
    public Page<RecipeSummaryResponseDTO> getAllRecipes(Pageable pageable, String currentUsername) {
        Long currentUserId = getCurrentUserIdOrNull(currentUsername);

        return recipeRepository.findAll(pageable).map(recipe -> {
            Double avgRating = ratingRepository.findAverageScoreByRecipeId(recipe.getId());
            int favCount = favoriteRepository.countByRecipeId(recipe.getId());
            boolean isFav = currentUserId != null
                    && favoriteRepository.existsByUserIdAndRecipeId(currentUserId, recipe.getId());

            return recipeMapper.toSummaryResponseDTO(
                    recipe,
                    avgRating != null ? avgRating : 0.0,
                    favCount,
                    isFav
            );
        });
    }

    @Override
    public Page<RecipeSummaryResponseDTO> searchRecipes(
            String query,
            Long categoryId,
            Integer maxTime,
            Double minRating,
            Pageable pageable,
            String currentUsername) {

        Long currentUserId = getCurrentUserIdOrNull(currentUsername);

        Specification<Recipe> spec = Specification.where(RecipeSpecifications.hasName(query))
                .and(RecipeSpecifications.hasCategory(categoryId))
                .and(RecipeSpecifications.maxPreparationTime(maxTime))
                .and(RecipeSpecifications.hasMinAverageRating(minRating)); // Используем метод!

        return recipeRepository.findAll(spec, pageable).map(recipe -> {
            Double avgRating = ratingRepository.findAverageScoreByRecipeId(recipe.getId());
            int favCount = favoriteRepository.countByRecipeId(recipe.getId());
            boolean isFav = currentUserId != null
                    && favoriteRepository.existsByUserIdAndRecipeId(currentUserId, recipe.getId());

            return recipeMapper.toSummaryResponseDTO(
                    recipe,
                    avgRating != null ? avgRating : 0.0,
                    favCount,
                    isFav
            );
        });
    }

    @Override
    public RecipeResponseDTO getRecipeById(Long id, String currentUsername) {
        Recipe recipe = recipeRepository.findDetailedById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found: " + id));

        Double averageRating = ratingRepository.findAverageScoreByRecipeId(recipe.getId());
        int favoritesCount = favoriteRepository.countByRecipeId(recipe.getId());

        Long currentUserId = getCurrentUserIdOrNull(currentUsername);
        boolean favorite = currentUserId != null
                && favoriteRepository.existsByUserIdAndRecipeId(currentUserId, recipe.getId());

        return recipeMapper.toResponseDTO(
                recipe,
                averageRating != null ? averageRating : 0.0,
                favoritesCount,
                favorite
        );
    }

    @Override
    public RecipeResponseDTO updateRecipe(Long recipeId, RecipeUpdateRequestDTO dto, String currentUsername) {
        Recipe recipe = recipeRepository.findDetailedById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found: " + recipeId));

        if (!recipe.getAuthor().getUsername().equals(currentUsername)) {
            throw new IllegalArgumentException("You can update only your own recipes");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + dto.getCategoryId()));

        recipe.setName(dto.getName());
        recipe.setDescription(dto.getDescription());
        recipe.setPreparationTimeMinutes(dto.getPreparationTimeMinutes());
        recipe.setServings(dto.getServings());
        recipe.setCategory(category);

        if (dto.getIngredients() != null) {
            recipe.getIngredients().clear();
        }

        if (dto.getSteps() != null) {
            recipe.getSteps().clear();
        }

        if (dto.getImages() != null) {
            recipe.getImages().clear();
        }

        recipeRepository.saveAndFlush(recipe);

        if (dto.getIngredients() != null) {
            ingredientMapper.toEntityList(dto.getIngredients(), recipe)
                    .forEach(recipe::addIngredient);
        }

        if (dto.getSteps() != null) {
            recipeStepMapper.toEntityList(dto.getSteps(), recipe)
                    .forEach(recipe::addStep);
        }

        if (dto.getImages() != null) {
            recipeImageMapper.toEntityList(dto.getImages(), recipe)
                    .forEach(recipe::addImage);
        }

        Recipe updatedRecipe = recipeRepository.save(recipe);

        Double averageRating = ratingRepository.findAverageScoreByRecipeId(updatedRecipe.getId());
        int favoritesCount = favoriteRepository.countByRecipeId(updatedRecipe.getId());

        Long currentUserId = getCurrentUserIdOrNull(currentUsername);
        boolean favorite = currentUserId != null
                && favoriteRepository.existsByUserIdAndRecipeId(currentUserId, updatedRecipe.getId());

        return recipeMapper.toResponseDTO(
                updatedRecipe,
                averageRating != null ? averageRating : 0.0,
                favoritesCount,
                favorite
        );
    }

    @Override
    public void deleteRecipe(Long recipeId, String currentUsername) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found: " + recipeId));

        if (!recipe.getAuthor().getUsername().equals(currentUsername)) {
            throw new IllegalArgumentException("You can delete only your own recipes");
        }

        for (RecipeImage image : recipe.getImages()){
            deletePhysicalFile(image.getUrl());
        }

        recipeRepository.delete(recipe);
    }

    private Long getCurrentUserIdOrNull(String currentUsername) {
        if (currentUsername == null || currentUsername.isBlank()) {
            return null;
        }

        return userRepository.findByUsername(currentUsername)
                .map(User::getId)
                .orElse(null);
    }

    @Override
    public Page<RecipeSummaryResponseDTO> getMyRecipes(Pageable pageable, String username) {
        Long currentUserId = getCurrentUserIdOrNull(username);

        Page<Recipe> recipes = recipeRepository.findAllByAuthorUsername(username, pageable);

        return recipes.map(recipe -> {
            Double avgRating = ratingRepository.findAverageScoreByRecipeId(recipe.getId());
            int favCount = favoriteRepository.countByRecipeId(recipe.getId());

            boolean isFav = currentUserId != null
                    && favoriteRepository.existsByUserIdAndRecipeId(currentUserId, recipe.getId());

            return recipeMapper.toSummaryResponseDTO(
                    recipe,
                    avgRating != null ? avgRating : 0.0,
                    favCount,
                    isFav
            );
        });
    }

    @Override
    public RecipeImageResponseDTO uploadRecipeImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        try {
            String uploadDir = "uploads/recipes/";
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return RecipeImageResponseDTO.builder()
                    .url("/uploads/recipes/" + fileName)
                    .build();
        } catch (IOException e) {
            throw new RuntimeException("Could not store file: " + e.getMessage());
        }
    }

    private void deletePhysicalFile(String relativePath) {
        try {
            String pathOnDisk = relativePath.startsWith("/") ? relativePath.substring(1) : relativePath;
            Path filePath = Paths.get(pathOnDisk);
            Files.deleteIfExists(filePath);
            log.info("Physical file deleted: {}", pathOnDisk);
        } catch (IOException e) {
            log.error("Failed to delete physical file: {}", relativePath, e);
        }
    }
}