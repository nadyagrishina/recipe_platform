package com.nadyagrishina.recipesplatform.repository;

import com.nadyagrishina.recipesplatform.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
}
