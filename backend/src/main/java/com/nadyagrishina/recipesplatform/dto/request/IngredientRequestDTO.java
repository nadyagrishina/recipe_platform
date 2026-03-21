package com.nadyagrishina.recipesplatform.dto.request;

import com.nadyagrishina.recipesplatform.entity.Unit;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientRequestDTO {

    @NotBlank
    @Size(min = 1, max = 255)
    private String name;

    @NotNull
    @Min(0)
    private BigDecimal amount;

    @NotNull
    private Unit unit;
}