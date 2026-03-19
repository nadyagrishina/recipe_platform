package com.nadyagrishina.recipesplatform.repository;

import com.nadyagrishina.recipesplatform.entity.Recipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long>, JpaSpecificationExecutor<Recipe> {

    @Override
    @EntityGraph(attributePaths = {"author", "category", "images"})
    Page<Recipe> findAll(Specification<Recipe> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "category", "images"})
    Optional<Recipe> findDetailedById(Long id);

    @EntityGraph(attributePaths = {"author", "category", "images"})
    Page<Recipe> findAllByAuthorUsername(String username, Pageable pageable);
}