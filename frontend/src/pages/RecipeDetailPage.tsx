import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TEXTS, type Language } from "../constants/texts";
import { getRecipeById, deleteRecipe, updateRecipe } from "../api/recipes";
import { ArrowBackIcon, HeartIcon, TimerIcon, StarIcon } from "../components/ui/icons";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { convertIngredient, type UnitSystem } from "../utils/unitConverter";
import { RecipeForm } from "../components/recipes/RecipeForm";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [commentText, setCommentText] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const isAuthor =
    !!user &&
    !!recipe &&
    (user.id === recipe.author?.id || user.username === recipe.author?.username);
  const getDefaultUnitSystem = (): UnitSystem => {
    return (user?.userSettingsDTO?.measurementUnitSystem as UnitSystem) || "METRIC";
  };

  const [unitSystem, setUnitSystem] = useState<UnitSystem>(getDefaultUnitSystem());

  useEffect(() => {
    if (!id) return;
    loadRecipeData();
    setUnitSystem(getDefaultUnitSystem());
    setActiveImgIdx(0);
    loadCategories();
  }, [id]);

  useEffect(() => {
    setUnitSystem(getDefaultUnitSystem());
  }, [user]);


  async function loadCategories() {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data || res);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  }

  async function loadRecipeData() {
    try {
      setLoading(true);
      setError(null);
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
    } catch (err) {
      console.error(err);
    }
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

  const getUserRating = (userId: number) => {
    const rating = recipe.ratings?.find((r: any) => r.user?.id === userId || r.userId === userId);
    return rating ? rating.score : null;
  };

  const handleUnitSystemChange = () => {
    setUnitSystem((prev) => (prev === "METRIC" ? "IMPERIAL" : "METRIC"));
  };

  if (loading) return <section className="recipe-detail"><p>{t.recipeDetail.actions.loading}</p></section>;
  if (error || !recipe) return <section className="recipe-detail"><h2>{error}</h2></section>;

  const getFullUrl = (path: string) => (path?.startsWith("http") ? path : `${API_URL}${path}`);

  const formatIngredient = (amount: number, unit: string) => {
    return convertIngredient(amount, unit, unitSystem, t.createRecipe.form.units);
  };

  const mainImage = recipe.images && recipe.images.length > 0
    ? getFullUrl(recipe.images[activeImgIdx].url)
    : "/images/default-recipe.png";

  const handleDelete = async () => {
    if (!window.confirm(d.hints.deleteRecipe)) return;
    try {
      await deleteRecipe(Number(id));
      navigate(-1);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleUpdate = async (formData: any) => {
    try {
      setLoading(true);
      await updateRecipe(Number(id), formData);
      setIsEditing(false);
      await loadRecipeData();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEditing) return <section className="recipe-detail"><p>{t.profile.loading}</p></section>;
  if (error || !recipe) return <section className="recipe-detail"><h2>{error}</h2></section>;

  if (isEditing) {
    return (
      <section className="recipe-detail">
        <div className="recipe-detail__header">
          <button onClick={() => setIsEditing(false)} className="recipe-detail__back">
            <ArrowBackIcon className="icon-sm" /> {d.actions.back}
          </button>
          <h2 className="recipe-detail__title">{t.editRecipe.title}</h2>
        </div>
        <RecipeForm
          initialData={recipe}
          onSubmit={handleUpdate}
          submitLabel={t.createRecipe.form.actions.submit}
          lang={lang}
          categories={categories}
          unitSystem={unitSystem}
          isEditMode={true}
        />
      </section>
    );
  }

  return (
    <section className="recipe-detail">
      <header className="recipe-detail__header">
        <div className="recipe-detail__nav-row">
          <button onClick={() => navigate(-1)} className="recipe-detail__back">
            <ArrowBackIcon className="icon-sm" /> {d.actions.back}
          </button>
          {isAuthor && (
            <div className="recipe-detail__author-actions">
              <button className="recipe-detail__btn recipe-detail__btn--edit" onClick={() => setIsEditing(true)}>
                {d.actions.editRecipe}
              </button>
              <button className="recipe-detail__btn recipe-detail__btn--delete" onClick={handleDelete}>
                {d.actions.deleteRecipe}
              </button>
            </div>
          )}
        </div>
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
            <strong>{d.meta?.author}:</strong> {recipe.author?.username}
          </span>
          <span className="recipe-detail__dot">•</span>
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
            <div className="recipe-detail__gallery-main" onClick={() => recipe.images?.length > 0 && setIsModalOpen(true)}>
              <img src={mainImage} alt={recipe.name} className="recipe-detail__image" style={{ cursor: 'pointer' }} />
            </div>
            {recipe.images?.length > 1 && (
              <div className="recipe-detail__thumbnails">
                {recipe.images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    className={`recipe-detail__thumb ${activeImgIdx === idx ? "recipe-detail__thumb--active" : ""}`}
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
              <button className="recipe-detail__btn" onClick={handleUnitSystemChange}>
                {unitSystem === "METRIC" ? `→ ${d.actions.imperial}` : `→ ${d.actions.metric}`}
              </button>
            </div>
            <ul className="recipe-detail__ingredients">
              {recipe.ingredients?.map((ing: any, i: number) => {
                const { amount, unit } = formatIngredient(ing.amount, ing.unit);
                return (
                  <li key={i} className="recipe-detail__ingredient">
                    <span className="recipe-detail__step-index">{i + 1}.</span>
                    <div className="recipe-detail__unit-amount">
                      <strong>{amount}</strong>
                      <span>{unit}</span>
                    </div>
                    <span>{ing.name}</span>
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
              <div className="recipe-detail__rating-select" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = hoverRating >= star || (hoverRating === 0 && userRating >= star);

                  return (
                    <button
                      key={star}
                      type="button"
                      className="recipe-detail__star-btn"
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                    >
                      <StarIcon
                        className={`icon-md ${isFilled ? "recipe-card__parameters--rating" : ""}`}
                      />
                    </button>
                  );
                })}
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
                className="recipe-detail__btn recipe-detail__btn--comment"
                onClick={handleSubmitFeedback}
                disabled={isSubmittingFeedback}
              >
                {isSubmittingFeedback ? "..." : d.actions.sendComment}
              </button>
            </div>
          </div>
        </div>

        <div className="recipe-detail__comment-list">
          {recipe.comments?.length > 0 ? (
            recipe.comments.map((c: any) => {
              const userScore = getUserRating(c.user?.id);
              const avatarPath = c.user?.userSettingsDTO?.imageUrl || c.user?.imageUrl;
              const commentUserAvatar = avatarPath
                ? (avatarPath.startsWith("http") ? avatarPath : `${API_URL}${avatarPath}`)
                : "/images/default-avatar.png";

              const formattedDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString(lang === 'cz' ? 'cz-CZ' : 'en-EN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : "—";

              return (
                <div key={c.id} className="recipe-detail__comment">
                  <div className="recipe-detail__comment-avatar-container">
                    <img
                      src={commentUserAvatar}
                      alt={c.user?.username}
                      className="recipe-detail__comment-avatar"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/images/default-avatar.png" }}
                    />
                  </div>

                  <div className="recipe-detail__comment-main">
                    <div className="recipe-detail__comment-head">
                      <div className="recipe-detail__comment-user-info">
                        <strong>{c.user?.username}</strong>
                        {userScore && (
                          <div className="recipe-detail__comment-rating">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <StarIcon
                                key={s}
                                className={`icon-sm ${s <= userScore ? "recipe-card__parameters--rating" : ""}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="recipe-detail__comment-meta">{formattedDate}</span>
                    </div>
                    <p className="recipe-detail__comment-text">{c.text}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>{t.recipeDetail.hints.noComments}</p>
          )}
        </div>
      </div>

      {
        isModalOpen && recipe.images && recipe.images.length > 0 && (
          <div className="profile__modal" onClick={() => setIsModalOpen(false)}>
            <div className="profile__modal-content">
              <img src={mainImage} alt={recipe.name} />
              <button className="profile__modal-close">✕</button>
            </div>
          </div>
        )
      }
    </section >
  );
}