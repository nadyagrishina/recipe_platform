package com.nadyagrishina.recipesplatform.specification;

import com.nadyagrishina.recipesplatform.entity.Recipe;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Join;
import com.nadyagrishina.recipesplatform.entity.Rating;

public class RecipeSpecifications {

    public static Specification<Recipe> hasName(String name) {
        return (root, query, cb) ->
                (name == null || name.isBlank()) ? null : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Recipe> hasCategory(Long categoryId) {
        return (root, query, cb) ->
                categoryId == null ? null : cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Recipe> maxPreparationTime(Integer minutes) {
        return (root, query, cb) ->
                minutes == null ? null : cb.lessThanOrEqualTo(root.get("preparationTimeMinutes"), minutes);
    }

    public static Specification<Recipe> hasMinAverageRating(Double minRating) {
        return (root, query, cb) -> {
            if (minRating == null) return null;
            Join<Recipe, Rating> ratings = root.join("ratings");
            query.groupBy(root.get("id"));
            query.having(cb.greaterThanOrEqualTo(cb.avg(ratings.get("score")), minRating));
            return null;
        };
    }
}