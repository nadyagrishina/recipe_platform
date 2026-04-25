package com.nadyagrishina.recipesplatform.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "COMMENTS")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment extends BaseEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 2000, columnDefinition = "TEXT")
    private String text;

    public static Comment create(Recipe recipe, User user, String text){
        Comment comment = new Comment();
        comment.recipe = recipe;
        comment.user = user;
        comment.text = text;
        return comment;
    }
}
