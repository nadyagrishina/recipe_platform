package com.nadyagrishina.recipesplatform.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(
        name = "ingredients",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"recipe_id", "name"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Ingredient extends BaseEntity{

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Unit unit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    public static Ingredient create(String name, BigDecimal amount, Unit unit, Recipe recipe) {
        Ingredient ingredient = new Ingredient();
        ingredient.name = name;
        ingredient.amount = amount;
        ingredient.unit = unit;
        ingredient.recipe = recipe;
        return ingredient;
    }
}
