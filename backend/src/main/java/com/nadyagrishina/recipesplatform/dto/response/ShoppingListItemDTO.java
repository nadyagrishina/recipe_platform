package com.nadyagrishina.recipesplatform.dto.response;

import com.nadyagrishina.recipesplatform.entity.Unit;
import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;

@Getter
@Builder
public class ShoppingListItemDTO {
    private String name;
    private BigDecimal amount;
    private Unit unit;
}