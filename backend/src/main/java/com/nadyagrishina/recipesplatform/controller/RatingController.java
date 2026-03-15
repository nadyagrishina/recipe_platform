package com.nadyagrishina.recipesplatform.controller;

import com.nadyagrishina.recipesplatform.dto.request.RatingRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.RatingResponseDTO;
import com.nadyagrishina.recipesplatform.service.RatingService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/recipes/{recipeId}/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RatingResponseDTO rateRecipe(@PathVariable Long recipeId,
                                        @Valid @RequestBody RatingRequestDTO request,
                                        Authentication authentication) {
        return ratingService.rateRecipe(recipeId, request, authentication.getName());
    }

    @PutMapping
    public RatingResponseDTO updateRating(@PathVariable Long recipeId,
                                          @Valid @RequestBody RatingRequestDTO request,
                                          Authentication authentication) {
        return ratingService.rateRecipe(recipeId, request, authentication.getName());
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRating(@PathVariable Long recipeId,
                             Authentication authentication) {
        ratingService.deleteRating(recipeId, authentication.getName());
    }
}