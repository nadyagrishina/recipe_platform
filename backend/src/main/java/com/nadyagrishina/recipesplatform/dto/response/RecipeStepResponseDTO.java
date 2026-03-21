package com.nadyagrishina.recipesplatform.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeStepResponseDTO {
    private Long id;
    private Integer stepNumber;
    private String description;
}