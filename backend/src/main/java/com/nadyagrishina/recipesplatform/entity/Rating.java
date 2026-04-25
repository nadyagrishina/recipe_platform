package com.nadyagrishina.recipesplatform.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "RATINGS")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class Rating {

    @EmbeddedId
    private RatingId id = new RatingId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("recipeId")
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;

    @Column(nullable = false)
    private Integer score;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public static Rating create(User user, Recipe recipe, Integer score){
        Rating rating = new Rating();
        rating.user = user;
        rating.recipe = recipe;
        rating.score = score;
        rating.id = new RatingId(user.getId(), recipe.getId());
        return rating;
    }

    public void changeScore(Integer score) {
        this.score = score;
    }
}
