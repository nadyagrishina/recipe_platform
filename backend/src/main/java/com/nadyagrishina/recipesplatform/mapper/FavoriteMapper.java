package com.nadyagrishina.recipesplatform.mapper;

import com.nadyagrishina.recipesplatform.dto.response.FavoriteResponseDTO;
import com.nadyagrishina.recipesplatform.entity.Favorite;
import com.nadyagrishina.recipesplatform.entity.Recipe;
import com.nadyagrishina.recipesplatform.entity.User;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class FavoriteMapper {

    public Favorite toEntity(User user, Recipe recipe) {
        return Favorite.create(user, recipe);
    }

    public FavoriteResponseDTO toResponseDTO(Favorite favorite) {
        if (favorite == null) {
            return null;
        }

        return FavoriteResponseDTO.builder()
                .userId(favorite.getUser().getId())
                .recipeId(favorite.getRecipe().getId())
                .build();
    }

    public List<FavoriteResponseDTO> toResponseDTOList(List<Favorite> favorites) {
        if (favorites == null) {
            return Collections.emptyList();
        }

        return favorites.stream()
                .map(this::toResponseDTO)
                .toList();
    }
}