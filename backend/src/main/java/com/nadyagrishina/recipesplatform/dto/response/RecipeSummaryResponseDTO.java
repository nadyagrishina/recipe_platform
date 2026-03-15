package com.nadyagrishina.recipesplatform.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeSummaryResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Integer preparationTimeMinutes;
    private Integer servings;

    private UserResponseDTO author;
    private CategoryResponseDTO category;

    private String previewImageUrl;
    private Double averageRating;
    private Integer ratingsCount;
    private Integer favoritesCount;

    private LocalDateTime createdAt;
}