import { useState } from "react";
import { Link } from "react-router-dom";
import { HeartIcon, TimerIcon, StarIcon } from "../ui/icons";
import api from "../../api/axios";

const API_URL = "http://localhost:8080";

type Props = {
  recipe: any;
};

export function RecipeCard({ recipe }: Props) {
  const [isFavorite, setIsFavorite] = useState(recipe.favorite || false);

  const handleToggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const url = `/api/recipes/${recipe.id}/favorite`;
      if (isFavorite) {
        await api.delete(url);
      } else {
        await api.post(url);
      }
      setIsFavorite(!isFavorite);
    } catch (err: any) {
      console.error("Favorite toggle error:", err);
    }
  };

  const getImageUrl = () => {
    const rawPath = recipe.previewImageUrl || recipe.images?.[0]?.url;

    if (!rawPath) return "/images/default-recipe.png";

    if (rawPath.startsWith("http")) return rawPath;

    return `${API_URL}${rawPath}`;
  };

  const imageUrl = getImageUrl();
  const rating = recipe.averageRating || 0;
  const time = recipe.preparationTimeMinutes || 0;

  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card recipe-card--link">
      <div className="recipe-card__image">
        <img
          className="recipe-card__image--img"
          src={imageUrl}
          alt={recipe.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/default-recipe.png";
          }}
        />
      </div>

      <div className="recipe-card__content">
        <h4 className="recipe-card__title">{recipe.name}</h4>
        <p className="recipe-card__description">{recipe.description}</p>
        <div className="recipe-card__meta">
          <div className="recipe-card__parameters-wrapper">
            <div className="recipe-card__parameters">
              <div className="recipe-card__parameters-inner">
                <StarIcon className="icon-md recipe-card__parameters--rating" />
                <span>{rating > 0 ? rating.toFixed(1) : "-"}</span>
              </div>
              <div className="recipe-card__parameters-inner">
                <TimerIcon className="icon-md recipe-card__parameters--timer" />
                <span>{time} min</span>
              </div>
            </div>
            <span className="recipe-card__author-name">
              @{recipe.author?.username || "user"}
            </span>
          </div>
          <button
            type="button"
            className={`recipe-card__favorite ${isFavorite ? "recipe-card__favorite--active" : ""}`}
            onClick={handleToggleFavorite}
          >
            <HeartIcon filled={isFavorite} className="recipe-card__favorite-icon" />
          </button>
        </div>
      </div>
    </Link>
  );
}