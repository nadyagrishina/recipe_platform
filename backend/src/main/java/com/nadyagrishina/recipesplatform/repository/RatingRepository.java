package com.nadyagrishina.recipesplatform.repository;

import com.nadyagrishina.recipesplatform.entity.Rating;
import com.nadyagrishina.recipesplatform.entity.RatingId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, RatingId> {

    int countByRecipeId(Long recipeId);

    Optional<Rating> findByUserIdAndRecipeId(Long userId, Long recipeId);

    boolean existsByUserIdAndRecipeId(Long userId, Long recipeId);

    @Query("""
            select avg(r.score)
            from Rating r
            where r.recipe.id = :recipeId
            """)
    Double findAverageScoreByRecipeId(Long recipeId);
}