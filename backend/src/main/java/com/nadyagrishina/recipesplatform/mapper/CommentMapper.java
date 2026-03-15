package com.nadyagrishina.recipesplatform.mapper;

import com.nadyagrishina.recipesplatform.dto.request.CommentRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.CommentResponseDTO;
import com.nadyagrishina.recipesplatform.entity.Comment;
import com.nadyagrishina.recipesplatform.entity.Recipe;
import com.nadyagrishina.recipesplatform.entity.User;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class CommentMapper {

    private final UserMapper userMapper;

    public CommentMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public Comment toEntity(CommentRequestDTO dto, Recipe recipe, User user) {
        return Comment.create(recipe, user, dto.getText());
    }

    public CommentResponseDTO toResponseDTO(Comment comment) {
        if (comment == null) {
            return null;
        }

        return CommentResponseDTO.builder()
                .id(comment.getId())
                .recipeId(comment.getRecipe().getId())
                .user(userMapper.toResponseDTO(comment.getUser()))
                .text(comment.getText())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    public List<CommentResponseDTO> toResponseDTOList(List<Comment> comments) {
        if (comments == null) {
            return Collections.emptyList();
        }

        return comments.stream()
                .map(this::toResponseDTO)
                .toList();
    }
}