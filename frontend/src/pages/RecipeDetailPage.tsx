import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { TEXTS, type Language } from "../constants/texts";
import { getRecipeById, toggleFavorite as toggleFavoriteApi } from "../api/recipes";
import { ArrowBackIcon, HeartIcon } from "../components/ui/icons";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

type Props = { lang: Language };

export default function RecipeDetailPage({ lang }: Props) {
  const t = TEXTS[lang];
  const d = t.recipeDetail;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isFavorite, setIsFavorite] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    async function loadRecipe() {
      try {
        setLoading(true);
        setError(null);
        const response = await getRecipeById(Number(id));
        setRecipe(response.data);
        setIsFavorite(response.data.favorite || false);
      } catch (err: any) {
        setError(err.response?.status === 404 ? d.errors.notFound : "Chyba při načítání");
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [id, d.errors.notFound]);

  const handleToggleFavorite = async () => {
  if (!user) {
    navigate("/login");
    return;
  }

  try {
    if (isFavorite) {
      await api.delete(`/api/recipes/${Number(id)}/favorite`);
    } else {
      await api.post(`/api/recipes/${Number(id)}/favorite`);
    }
    
    setIsFavorite(!isFavorite);
  } catch (err: any) {
    if (err.response?.status === 409) {
       setIsFavorite(!isFavorite);
    }
    console.error("Favorite toggle failed:", err);
  }
};

  if (loading) return <section className="recipe-detail"><p>{t.profile.loading}</p></section>;
  if (error || !recipe) return <section className="recipe-detail"><h2>{error}</h2></section>;

  return (
    <section className="recipe-detail">
      <header className="recipe-detail__header">
        <button onClick={() => navigate(-1)} className="recipe-detail__back">
          <ArrowBackIcon className="icon-sm" /> {d.actions.back}
        </button>

        <div className="recipe-detail__title-row">
          <h2 className="recipe-detail__title">{recipe.name}</h2>

          <button
            type="button"
            className={`recipe-card__favorite ${isFavorite ? "recipe-card__favorite--active" : ""
              }`}
            onClick={handleToggleFavorite}
          >
            <HeartIcon
              filled={isFavorite}
              className="recipe-card__favorite-icon"
            />
          </button>
        </div>

        <div className="recipe-detail__meta">
          <span className="recipe-detail__meta-item">
            {recipe.averageRating > 0 ? `${recipe.averageRating} ★` : d.meta.noRating}
          </span>
          <span className="recipe-detail__dot">•</span>
          <span className="recipe-detail__meta-item">
            {d.meta.time}: {recipe.preparationTimeMinutes} {d.meta.minutes}
          </span>
          <span className="recipe-detail__dot">•</span>
          <span className="recipe-detail__meta-item">
            {d.meta.servings}: {recipe.servings}
          </span>
        </div>
      </header>

      <div className="recipe-detail__main-layout">
        <section className="recipe-detail__gallery">
          <div className="recipe-detail__gallery-main">
            <img
              src={recipe.images?.[0]?.url || "/images/default-recipe.png"}
              alt={recipe.name}
              className="recipe-detail__image"
            />
          </div>
        </section>

        <div className="recipe-detail__content">
          <div className="recipe-detail__section">
            <p className="recipe-detail__description">
              {recipe.description || d.hints.noDescription}
            </p>
          </div>

          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="recipe-detail__section">
              <h3 className="recipe-detail__section-title">{t.createRecipe.form.sections.ingredients}</h3>
              <ul className="recipe-detail__list">
                {recipe.ingredients.map((ing: any, i: number) => (
                  <li key={i} className="recipe-detail__list-item">
                    {ing.amount} {ing.unit} — {ing.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recipe.steps && recipe.steps.length > 0 && (
            <div className="recipe-detail__section">
              <h3 className="recipe-detail__section-title">{t.createRecipe.form.sections.steps}</h3>
              <ol className="recipe-detail__list">
                {recipe.steps
                  .sort((a: any, b: any) => a.stepNumber - b.stepNumber)
                  .map((step: any, i: number) => (
                    <li key={i} className="recipe-detail__list-item">
                      <strong>{step.stepNumber}.</strong> {step.description}
                    </li>
                  ))}
              </ol>
            </div>
          )}
        </div>
        {recipe.comments && (
          <div className="recipe-detail__section">
            <h3>{t.recipeDetail.sections.comments || "Komentáře"}</h3>
            <div className="recipe-detail__comments">
              {recipe.comments.length > 0 ? (
                recipe.comments.map((comment: any) => (
                  <div key={comment.id} className="comment">
                    <strong>{comment.user.username}</strong>
                    <p>{comment.text}</p>
                  </div>
                ))
              ) : (
                <p>{t.recipeDetail.hints.noComments || "Zatím žádné komentáře"}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}