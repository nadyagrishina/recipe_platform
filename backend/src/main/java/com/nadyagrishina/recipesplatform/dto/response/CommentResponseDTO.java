package com.nadyagrishina.recipesplatform.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponseDTO {
    private Long id;
    private Long recipeId;
    private UserResponseDTO user;
    private String text;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}