package com.nadyagrishina.recipesplatform.controller;

import com.nadyagrishina.recipesplatform.dto.response.ShoppingListItemDTO;
import com.nadyagrishina.recipesplatform.service.ShoppingListService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shopping-list")
@RequiredArgsConstructor
public class ShoppingListController {

    private final ShoppingListService shoppingListService;

    @PostMapping("/generate")
    public List<ShoppingListItemDTO> generate(@RequestBody List<Long> recipeIds) {
        return shoppingListService.generateShoppingList(recipeIds);
    }
}