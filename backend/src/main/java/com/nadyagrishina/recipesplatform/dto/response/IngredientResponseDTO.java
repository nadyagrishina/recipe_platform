package com.nadyagrishina.recipesplatform.dto.response;

import com.nadyagrishina.recipesplatform.entity.Unit;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientResponseDTO {
    private Long id;
    private String name;
    private BigDecimal amount;
    private Unit unit;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}