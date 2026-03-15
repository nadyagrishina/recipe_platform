package com.nadyagrishina.recipesplatform.repository;

import com.nadyagrishina.recipesplatform.entity.Comment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @EntityGraph(attributePaths = {"user", "recipe"})
    List<Comment> findByRecipeIdOrderByCreatedAtDesc(Long recipeId);
}