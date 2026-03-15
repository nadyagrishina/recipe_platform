package com.nadyagrishina.recipesplatform.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeImageResponseDTO {
    private Long id;
    private String url;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}