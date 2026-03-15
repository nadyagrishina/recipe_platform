package com.nadyagrishina.recipesplatform.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingResponseDTO {
    private Long userId;
    private Long recipeId;
    private Integer score;
    private LocalDateTime createdAt;
}