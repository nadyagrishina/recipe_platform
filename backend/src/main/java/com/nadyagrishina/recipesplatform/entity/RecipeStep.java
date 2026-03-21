package com.nadyagrishina.recipesplatform.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "recipe_steps",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"recipe_id", "step_number"}
        )
)
@Getter
@Setter(AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecipeStep{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "step_number", nullable = false)
    private Integer stepNumber;

    @Column(nullable = false, length = 2000, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    public static RecipeStep create(Integer stepNumber, String description, Recipe recipe) {
        RecipeStep step = new RecipeStep();
        step.stepNumber = stepNumber;
        step.description = description;
        step.recipe = recipe;
        return step;
    }
}
