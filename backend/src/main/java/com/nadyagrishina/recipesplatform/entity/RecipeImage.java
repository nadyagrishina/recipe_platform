package com.nadyagrishina.recipesplatform.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "RECIPE_IMAGES")
@Getter
@Setter(AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecipeImage extends BaseEntity{

    @Column(nullable = false, length = 1000)
    private String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    public static RecipeImage create(String url, Recipe recipe) {
        RecipeImage image = new RecipeImage();
        image.url = url;
        image.recipe = recipe;
        return image;
    }
}
