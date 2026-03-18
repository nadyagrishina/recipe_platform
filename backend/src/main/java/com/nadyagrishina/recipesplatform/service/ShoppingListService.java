package com.nadyagrishina.recipesplatform.service;

import com.nadyagrishina.recipesplatform.dto.response.ShoppingListItemDTO;
import java.util.List;

public interface ShoppingListService {
    List<ShoppingListItemDTO> generateShoppingList(List<Long> recipeIds);
}