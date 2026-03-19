package com.nadyagrishina.recipesplatform.controller;

import com.nadyagrishina.recipesplatform.dto.response.FavoriteResponseDTO;
import com.nadyagrishina.recipesplatform.dto.response.RecipeSummaryResponseDTO;
import com.nadyagrishina.recipesplatform.service.FavoriteService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/recipes/{recipeId}/favorite")
    @ResponseStatus(HttpStatus.OK)
    public FavoriteResponseDTO addToFavorites(@PathVariable Long recipeId,
                                              Authentication authentication) {
        return favoriteService.addToFavorites(recipeId, authentication.getName());
    }

    @DeleteMapping("/recipes/{recipeId}/favorite")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFromFavorites(@PathVariable Long recipeId,
                                    Authentication authentication) {
        favoriteService.removeFromFavorites(recipeId, authentication.getName());
    }

    @GetMapping("/users/me/favorites")
    public List<RecipeSummaryResponseDTO> getMyFavorites(Authentication authentication) {
        return favoriteService.getMyFavorites(authentication.getName());
    }
}