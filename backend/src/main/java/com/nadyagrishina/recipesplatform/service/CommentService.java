package com.nadyagrishina.recipesplatform.service;

import com.nadyagrishina.recipesplatform.dto.request.CommentRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.CommentResponseDTO;

import java.util.List;

public interface CommentService {

    CommentResponseDTO addComment(Long recipeId, CommentRequestDTO request, String username);

    List<CommentResponseDTO> getRecipeComments(Long recipeId);

    void deleteComment(Long commentId, String username);
}