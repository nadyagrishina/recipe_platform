package com.nadyagrishina.recipesplatform.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Integer preparationTimeMinutes;
    private Integer servings;
    private LocalDateTime createdAt;
}