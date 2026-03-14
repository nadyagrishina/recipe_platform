import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TEXTS, type Language } from "../constants/texts";
import type { RecipeDetailApiResponse } from "../components/models/recipe";
import { ArrowBackIcon, HeartIcon } from "../components/ui/icons";

type Props = { lang: Language };

type RecipeDetail = {
  id: number;
  title: string;
  description: string;
  timeMinutes: number;
  servings: number;
};

export default function RecipeDetailPage({ lang }: Props) {
  const t = TEXTS[lang];
  const d = t.recipeDetail;

  const [isFavorite, setIsFavorite] = useState(false);
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    if (!Number.isFinite(id)) return;

    async function loadRecipe() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:8080/api/recipes/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch recipe: ${response.status}`);
        }

        const data: RecipeDetailApiResponse = await response.json();

        const mappedRecipe: RecipeDetail = {
          id: data.id,
          title: data.name,
          description: data.description,
          timeMinutes: data.preparationTimeMinutes,
          servings: data.servings,
        };

        setRecipe(mappedRecipe);
      } catch (err) {
        console.error("Failed to load recipe", err);
        setError("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [id]);

  if (!Number.isFinite(id)) {
    return (
      <section>
        <Link to="/categories" className="recipe-detail__back">
          <ArrowBackIcon className="recipe-detail__icon-back icon-sm" />
          {d.actions.back}
        </Link>
        <h2>{d.errors.invalidId}</h2>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="recipe-detail">
        <Link to="/categories" className="recipe-detail__back">
          <ArrowBackIcon className="recipe-detail__icon-back icon-sm" />
          {d.actions.back}
        </Link>
        <p>Loading recipe...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="recipe-detail">
        <Link to="/categories" className="recipe-detail__back">
          <ArrowBackIcon className="recipe-detail__icon-back icon-sm" />
          {d.actions.back}
        </Link>
        <p>{error}</p>
      </section>
    );
  }

  if (!recipe) {
    return (
      <section>
        <Link to="/categories" className="recipe-detail__back">
          <ArrowBackIcon className="recipe-detail__icon-back icon-sm" />
          {d.actions.back}
        </Link>
        <h2>{d.errors.notFound}</h2>
      </section>
    );
  }

  const toggleFavorite = () => setIsFavorite((prev) => !prev);

  return (
    <section className="recipe-detail">
      <header className="recipe-detail__header">
        <Link to="/categories" className="recipe-detail__back">
          <ArrowBackIcon className="recipe-detail__icon-back icon-sm" />
          {d.actions.back}
        </Link>

        <div className="recipe-detail__title-row">
          <h2 className="recipe-detail__title">{recipe.title}</h2>

          <button
            type="button"
            className={`recipe-card__favorite ${
              isFavorite ? "recipe-card__favorite--active" : ""
            }`}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? d.actions.removeFromFavorites
                : d.actions.addToFavorites
            }
            onClick={toggleFavorite}
          >
            <HeartIcon
              filled={isFavorite}
              className="recipe-card__favorite-icon"
            />
          </button>
        </div>

        <div className="recipe-detail__meta">
          <span className="recipe-detail__meta-item">{d.meta.noRating}</span>
          <span className="recipe-detail__dot">•</span>
          <span className="recipe-detail__meta-item">
            {d.meta.time}: {recipe.timeMinutes} {d.meta.minutes}
          </span>
          <span className="recipe-detail__dot">•</span>
          <span className="recipe-detail__meta-item">
            {d.meta.servings}: {recipe.servings}
          </span>
        </div>
      </header>

      <div className="recipe-detail__main-layout">
        <section className="recipe-detail__gallery">
          <h3 className="recipe-detail__section-title">{d.sections.photos}</h3>

          <div className="recipe-detail__gallery-main">
            <img
              src="/images/default-recipe.png"
              alt={recipe.title}
              className="recipe-detail__image"
            />
          </div>
        </section>

        <div className="recipe-detail__content">
          {recipe.description ? (
            <p className="recipe-detail__description">{recipe.description}</p>
          ) : (
            <div className="recipe-detail__empty">{d.hints.noDescription}</div>
          )}
        </div>
      </div>
    </section>
  );
}
