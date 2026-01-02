// src/components/recipe-card/RecipeCard.tsx
import { useState } from "react";
import { RecipeCardData } from "../types/recipe";
import { HeartIcon } from "../ui/icons";
import { TimerIcon } from "../ui/icons";
import { StarIcon } from "../ui/icons";

type Props = {
  recipe: RecipeCardData;
};

export function RecipeCard({ recipe }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  return (
    <article className="recipe-card">
      <div className="recipe-card__image">
        <img
          className="recipe-card__image--img"
          src={recipe.imageUrl || "/images/default-recipe.png"}
          alt={`Recipe: ${recipe.title}`}
        />
      </div>

      <div className="recipe-card__content">
        <h4 className="recipe-card__title">{recipe.title}</h4>

        <div className="recipe-card__meta">
          <div className="recipe-card__parameters">
            <div>
              {recipe.rating !== undefined && (
                <div className="recipe-card__parameters-inner">
                  <StarIcon className="icon-md recipe-card__parameters--rating" />
                  <span>{recipe.rating}</span>
                </div>
              )}
            </div>
            <div>
              {recipe.time !== undefined && (
                <div className="recipe-card__parameters-inner">
                  <TimerIcon className="icon-md recipe-card__parameters--timer" />
                  <span>{recipe.time} min</span>
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            className={`recipe-card__favorite ${
              isFavorite ? "recipe-card__favorite--active" : ""
            }`}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            onClick={toggleFavorite}
          >
            <HeartIcon
              filled={isFavorite}
              className="recipe-card__favorite-icon"
            />
          </button>
        </div>
      </div>
    </article>
  );
}
