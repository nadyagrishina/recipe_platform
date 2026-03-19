package com.nadyagrishina.recipesplatform.service.impl;

import com.nadyagrishina.recipesplatform.dto.request.RatingRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RatingResponseDTO;
import com.nadyagrishina.recipesplatform.entity.Rating;
import com.nadyagrishina.recipesplatform.entity.Recipe;
import com.nadyagrishina.recipesplatform.entity.User;
import com.nadyagrishina.recipesplatform.exception.ResourceNotFoundException;
import com.nadyagrishina.recipesplatform.mapper.RatingMapper;
import com.nadyagrishina.recipesplatform.repository.RatingRepository;
import com.nadyagrishina.recipesplatform.repository.RecipeRepository;
import com.nadyagrishina.recipesplatform.repository.UserRepository;
import com.nadyagrishina.recipesplatform.service.RatingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final RatingMapper ratingMapper;

    @Override
    @Transactional
    public RatingResponseDTO rateRecipe(Long recipeId, RatingRequestDTO request, String username) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found: " + recipeId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Rating rating = ratingRepository.findByUserIdAndRecipeId(user.getId(), recipeId)
                .orElseGet(() -> Rating.create(user, recipe, request.getScore()));

        rating.setScore(request.getScore());

        Rating saved = ratingRepository.save(rating);
        return ratingMapper.toResponseDTO(saved);
    }

    @Override
    public void deleteRating(Long recipeId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Rating rating = ratingRepository.findByUserIdAndRecipeId(user.getId(), recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found for recipe: " + recipeId));

        ratingRepository.delete(rating);
    }
}