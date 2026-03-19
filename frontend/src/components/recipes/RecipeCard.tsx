import { useState } from "react";
import { Link } from "react-router-dom";
import { HeartIcon, TimerIcon, StarIcon } from "../ui/icons";
import api from "../../api/axios"; // Импортируем напрямую или через методы выше

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
        // Если уже в избранном — шлем DELETE
        await api.delete(url);
      } else {
        // Если еще нет — шлем POST
        await api.post(url);
      }
      
      setIsFavorite(!isFavorite);
    } catch (err: any) {
      // Если сервер вернул 409, значит в базе лайк уже есть/нет. 
      // Синхронизируем стейт с реальностью.
      if (err.response?.status === 409) {
        setIsFavorite(!isFavorite);
      }
      console.error("Favorite toggle error:", err);
    }
  };

  const imageUrl = recipe.previewImageUrl || recipe.images?.[0]?.url || "/images/default-recipe.png";
  const rating = recipe.averageRating || 0;
  const time = recipe.preparationTimeMinutes || 0;

  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card recipe-card--link">
      <div className="recipe-card__image">
        <img className="recipe-card__image--img" src={imageUrl} alt={recipe.name} />
      </div>

      <div className="recipe-card__content">
        <h4 className="recipe-card__title">{recipe.name}</h4>
        <div className="recipe-card__meta">
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