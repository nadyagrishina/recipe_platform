package com.nadyagrishina.recipesplatform.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeStepResponseDTO {
    private Long id;
    private Integer stepNumber;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}