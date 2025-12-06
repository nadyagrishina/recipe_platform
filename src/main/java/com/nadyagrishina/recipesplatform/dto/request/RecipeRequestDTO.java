package com.nadyagrishina.recipesplatform.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeRequestDTO {
    @NotBlank
    @Size(min = 2, max = 255)
    private String name;

    @NotBlank
    @Size(min = 3, max = 10000)
    private String description;

    private List<String> imageUrls;
}
