package com.nadyagrishina.recipesplatform.repository;

import com.nadyagrishina.recipesplatform.entity.Favorite;
import com.nadyagrishina.recipesplatform.entity.FavoriteId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {

    int countByRecipeId(Long recipeId);

    boolean existsByUserIdAndRecipeId(Long userId, Long recipeId);

    Optional<Favorite> findByUserIdAndRecipeId(Long userId, Long recipeId);

    List<Favorite> findByUserId(Long userId);
}