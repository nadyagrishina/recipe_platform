package com.nadyagrishina.recipesplatform.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "recipe_images")
@Getter
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
