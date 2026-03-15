package com.nadyagrishina.recipesplatform.repository;

import com.nadyagrishina.recipesplatform.entity.Recipe;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    @Override
    @EntityGraph(attributePaths = {
            "author",
            "category",
            "ingredients",
            "steps",
            "images"
    })
    List<Recipe> findAll();

    @EntityGraph(attributePaths = {
            "author",
            "category",
            "ingredients",
            "steps",
            "images",
            "comments",
            "comments.user",
            "ratings",
            "favorites"
    })
    Optional<Recipe> findDetailedById(Long id);

    @Query("""
       select r from Recipe r
       where lower(r.name) like lower(concat('%', :query, '%'))
       """)
    List<Recipe> searchByName(String query);
}