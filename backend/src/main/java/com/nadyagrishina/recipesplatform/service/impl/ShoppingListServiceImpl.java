package com.nadyagrishina.recipesplatform.service.impl;

import com.nadyagrishina.recipesplatform.dto.response.ShoppingListItemDTO;
import com.nadyagrishina.recipesplatform.entity.Ingredient;
import com.nadyagrishina.recipesplatform.repository.RecipeRepository;
import com.nadyagrishina.recipesplatform.service.ShoppingListService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ShoppingListServiceImpl implements ShoppingListService {

    private final RecipeRepository recipeRepository;

    @Override
    public List<ShoppingListItemDTO> generateShoppingList(List<Long> recipeIds) {
        return recipeRepository.findAllById(recipeIds).stream()
                .flatMap(recipe -> recipe.getIngredients().stream())
                .collect(Collectors.toMap(
                        ingredient -> ingredient.getName().toLowerCase().trim() + "|" + ingredient.getUnit(),
                        ingredient -> ShoppingListItemDTO.builder()
                                .name(ingredient.getName())
                                .amount(ingredient.getAmount())
                                .unit(ingredient.getUnit())
                                .build(),
                        (existing, replacement) -> ShoppingListItemDTO.builder()
                                .name(existing.getName())
                                .amount(existing.getAmount().add(replacement.getAmount()))
                                .unit(existing.getUnit())
                                .build()
                ))
                .values()
                .stream()
                .toList();
    }
}