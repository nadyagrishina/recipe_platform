import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TEXTS, type Language } from "../constants/texts";
import { getRecipeById } from "../api/recipes";
import { ArrowBackIcon, HeartIcon, TimerIcon, StarIcon } from "../components/ui/icons";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const API_URL = "http://localhost:8080";

type Props = { lang: Language };

export default function RecipeDetailPage({ lang }: Props) {
  const t = TEXTS[lang];
  const d = t.recipeDetail;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const [commentText, setCommentText] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const [unitSystem, setUnitSystem] = useState(user?.settings?.measurementUnitSystem || 'METRIC');

  useEffect(() => {
    if (!id) return;
    loadRecipeData();
  }, [id]);

  async function loadRecipeData() {
    try {
      setLoading(true);
      const res = await getRecipeById(Number(id));
      const data = res.data || res;
      setRecipe(data);
      setIsFavorite(data.favorite || false);
    } catch (err: any) {
      setError(err.response?.status === 404 ? d.errors.notFound : "Error");
    } finally {
      setLoading(false);
    }
  }

  const handleToggleFavorite = async () => {
    if (!user) return navigate("/login");
    try {
      const url = `/api/recipes/${id}/favorite`;
      isFavorite ? await api.delete(url) : await api.post(url);
      setIsFavorite(!isFavorite);
    } catch (err) { console.error(err); }
  };

  const handleSubmitFeedback = async () => {
    if (!user) return navigate("/login");
    if (!commentText.trim() && userRating === 0) return;

    setIsSubmittingFeedback(true);
    try {
      if (userRating > 0) {
        await api.post(`/api/recipes/${id}/ratings`, { score: userRating });
      }
      if (commentText.trim()) {
        await api.post(`/api/recipes/${id}/comments`, { text: commentText });
      }
      setCommentText("");
      setUserRating(0);
      loadRecipeData();
    } catch (err) {
      console.error("Feedback submission failed:", err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const formatIngredient = (amount: number, unit: string) => {
    const unitMap = t.createRecipe.form.units;
    let displayAmount: string | number = amount;
    let displayUnit = unitMap[unit as keyof typeof unitMap] || unit;

    if (unitSystem === 'IMPERIAL') {
      if (unit === 'GRAM') { displayAmount = (amount * 0.035).toFixed(1); displayUnit = 'oz'; }
      else if (unit === 'KILOGRAM') { displayAmount = (amount * 2.2).toFixed(1); displayUnit = 'lb'; }
      else if (unit === 'MILLILITER') { displayAmount = (amount * 0.034).toFixed(1); displayUnit = 'fl oz'; }
    }
    return { displayAmount, displayUnit };
  };

  const getUserRating = (userId: number) => {
    const rating = recipe.ratings?.find((r: any) => r.user?.id === userId || r.userId === userId);
    return rating ? rating.score : null;
  };

  if (loading) return <section className="recipe-detail"><p>{t.profile.loading}</p></section>;
  if (error || !recipe) return <section className="recipe-detail"><h2>{error}</h2></section>;

  const getFullUrl = (path: string) => (path?.startsWith("http") ? path : `${API_URL}${path}`);

  return (
    <section className="recipe-detail">
      <header className="recipe-detail__header">
        <button onClick={() => navigate(-1)} className="recipe-detail__back">
          <ArrowBackIcon className="icon-sm" /> {d.actions.back}
        </button>
        <div className="recipe-detail__title-row">
          <h2 className="recipe-detail__title">{recipe.name}</h2>
          <button
            className={`recipe-card__favorite ${isFavorite ? "recipe-card__favorite--active" : ""}`}
            onClick={handleToggleFavorite}
          >
            <HeartIcon filled={isFavorite} className="recipe-card__favorite-icon" />
          </button>
        </div>
        <div className="recipe-detail__meta">
          <span className="recipe-detail__meta-item">
            <StarIcon className="icon-sm" /> {recipe.averageRating?.toFixed(1) || d.meta.noRating}
          </span>
          <span className="recipe-detail__dot">•</span>
          <span className="recipe-detail__meta-item">
            <TimerIcon className="icon-sm" /> {recipe.preparationTimeMinutes} {d.meta.minutes}
          </span>
          <span className="recipe-detail__dot">•</span>
          <span className="recipe-detail__meta-item">
            {d.meta.servings}: {recipe.servings}
          </span>
        </div>
      </header>

      <div className="recipe-detail__main-layout">
        <section className="recipe-detail__gallery">
          <div className="recipe-detail__gallery-grid">
            <div className="recipe-detail__gallery-main">
              <img
                src={getFullUrl(recipe.images?.[activeImgIdx]?.url) || "/images/default-recipe.png"}
                alt={recipe.name}
                className="recipe-detail__image"
              />
            </div>
            {recipe.images?.length > 1 && (
              <div className="recipe-detail__thumbnails">
                {recipe.images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    className={`recipe-detail__thumb ${activeImgIdx === idx ? 'recipe-detail__thumb--active' : ''}`}
                    onClick={() => setActiveImgIdx(idx)}
                  >
                    <img src={getFullUrl(img.url)} alt="" className="recipe-detail__thumb-img" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="recipe-detail__content">
          <p className="recipe-detail__description">{recipe.description || d.hints.noDescription}</p>

          <div className="recipe-detail__section">
            <div className="recipe-detail__comments-head">
              <h3 className="recipe-detail__section-title">{t.createRecipe.form.sections.ingredients}</h3>
              <button className="recipe-detail__btn" onClick={() => setUnitSystem(unitSystem === 'METRIC' ? 'IMPERIAL' : 'METRIC')}>
                {unitSystem === 'METRIC' ? "→ Imperial" : "→ Metric"}
              </button>
            </div>
            <ul className="recipe-detail__ingredients">
              {recipe.ingredients?.map((ing: any, i: number) => {
                const { displayAmount, displayUnit } = formatIngredient(ing.amount, ing.unit);
                return (
                  <li key={i} className="recipe-detail__ingredient">
                    <div className="recipe-detail__ingredient-amount--wrapper">
                      <span className="recipe-detail__ingredient-amount">{displayAmount}</span>{' '}
                      <span className="recipe-detail__ingredient-unit">{displayUnit}</span>
                    </div>
                    <span className="recipe-detail__ingredient-name">{ing.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="recipe-detail__section">
            <h3 className="recipe-detail__section-title">{t.createRecipe.form.sections.steps}</h3>
            <div className="recipe-detail__steps">
              {recipe.steps?.sort((a: any, b: any) => a.stepNumber - b.stepNumber).map((step: any) => (
                <div key={step.stepNumber} className="recipe-detail__step">
                  <span className="recipe-detail__step-index">{step.stepNumber}.</span>
                  <p className="recipe-detail__description">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="recipe-detail__comment-section">
        <div className="recipe-detail__section">
          <h3 className="recipe-detail__section-title">{d.actions.sendComment}</h3>
          <div className="recipe-detail__comment-form">
            <div className="recipe-detail__comment-form-row">
              <div className="recipe-detail__rating-select">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="recipe-detail__star-btn"
                    onClick={() => setUserRating(star)}
                  >
                    <StarIcon className={`icon-md ${star <= userRating ? 'recipe-card__parameters--rating' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="recipe-detail__comment-form-row">
              <textarea
                className="recipe-detail__textarea recipe-detail__label--grow"
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="..."
              />
            </div>

            <div className="recipe-detail__comment-actions">
              <button
                className="recipe-detail__btn"
                onClick={handleSubmitFeedback}
                disabled={isSubmittingFeedback}
              >
                {isSubmittingFeedback ? "..." : d.actions.sendComment}
              </button>
            </div>
          </div>
        </div>

        <div className="recipe-detail__section">
          <h3 className="recipe-detail__section-title">{t.recipeDetail.sections.comments}</h3>
          <div className="recipe-detail__comment-list">
            {recipe.comments?.length > 0 ? (
              recipe.comments.map((c: any) => {
                const userScore = getUserRating(c.user?.id);

                return (
                  <div key={c.id} className="recipe-detail__comment">
                    <div className="recipe-detail__comment-head">
                      <div className="recipe-detail__comment-user-info">
                        <strong>{c.user?.username}</strong>
                        {userScore && (
                          <div className="recipe-detail__comment-rating">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <StarIcon
                                key={s}
                                className={`icon-sm ${s <= userScore ? 'recipe-card__parameters--rating' : ''}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="recipe-detail__comment-meta">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="recipe-detail__comment-text">{c.text}</p>
                  </div>
                );
              })
            ) : (
              <p>{t.recipeDetail.hints.noComments}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}