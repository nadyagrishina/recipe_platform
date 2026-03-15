package com.nadyagrishina.recipesplatform.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeImageRequestDTO {

    @NotBlank
    @Size(max = 1000)
    private String url;
}