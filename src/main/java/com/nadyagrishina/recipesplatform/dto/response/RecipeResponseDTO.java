package com.nadyagrishina.recipesplatform.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeResponseDTO {
    private Long id;
    private String name;
    private String description;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
}
