package com.nadyagrishina.recipesplatform.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeUpdateRequestDTO {

    @NotBlank
    @Size(min = 2, max = 255)
    private String name;

    @NotBlank
    @Size(min = 3, max = 10000)
    private String description;

    @NotNull
    @Min(1)
    private Integer preparationTimeMinutes;

    @NotNull
    @Min(1)
    private Integer servings;

    @NotNull
    private Long categoryId;

    @Valid
    @NotEmpty
    private List<IngredientRequestDTO> ingredients;

    @Valid
    @NotEmpty
    private List<RecipeStepRequestDTO> steps;

    @Valid
    private List<RecipeImageRequestDTO> images;
}