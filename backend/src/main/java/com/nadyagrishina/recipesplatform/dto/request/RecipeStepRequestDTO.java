package com.nadyagrishina.recipesplatform.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeStepRequestDTO {

    @NotNull
    @Min(1)
    private Integer stepNumber;

    @NotBlank
    @Size(min = 1, max = 2000)
    private String description;
}