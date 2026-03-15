package com.nadyagrishina.recipesplatform.controller;

import com.nadyagrishina.recipesplatform.dto.request.CommentRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.CommentResponseDTO;
import com.nadyagrishina.recipesplatform.service.CommentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/recipes/{recipeId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponseDTO addComment(@PathVariable Long recipeId,
                                         @Valid @RequestBody CommentRequestDTO request,
                                         Authentication authentication) {
        return commentService.addComment(recipeId, request, authentication.getName());
    }

    @GetMapping("/recipes/{recipeId}/comments")
    public List<CommentResponseDTO> getRecipeComments(@PathVariable Long recipeId) {
        return commentService.getRecipeComments(recipeId);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(@PathVariable Long commentId,
                              Authentication authentication) {
        commentService.deleteComment(commentId, authentication.getName());
    }
}