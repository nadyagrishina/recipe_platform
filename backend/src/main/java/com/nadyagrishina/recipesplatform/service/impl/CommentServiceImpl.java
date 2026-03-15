package com.nadyagrishina.recipesplatform.service.impl;

import com.nadyagrishina.recipesplatform.dto.request.CommentRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.CommentResponseDTO;
import com.nadyagrishina.recipesplatform.entity.Comment;
import com.nadyagrishina.recipesplatform.entity.Recipe;
import com.nadyagrishina.recipesplatform.entity.User;
import com.nadyagrishina.recipesplatform.exception.ResourceNotFoundException;
import com.nadyagrishina.recipesplatform.mapper.CommentMapper;
import com.nadyagrishina.recipesplatform.repository.CommentRepository;
import com.nadyagrishina.recipesplatform.repository.RecipeRepository;
import com.nadyagrishina.recipesplatform.repository.UserRepository;
import com.nadyagrishina.recipesplatform.service.CommentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    @Override
    public CommentResponseDTO addComment(Long recipeId, CommentRequestDTO request, String username) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found: " + recipeId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Comment comment = commentMapper.toEntity(request, recipe, user);
        Comment saved = commentRepository.save(comment);

        return commentMapper.toResponseDTO(saved);
    }

    @Override
    public List<CommentResponseDTO> getRecipeComments(Long recipeId) {
        recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found: " + recipeId));

        return commentRepository.findByRecipeIdOrderByCreatedAtDesc(recipeId).stream()
                .map(commentMapper::toResponseDTO)
                .toList();
    }

    @Override
    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found: " + commentId));

        if (!comment.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("You can delete only your own comments");
        }

        commentRepository.delete(comment);
    }
}