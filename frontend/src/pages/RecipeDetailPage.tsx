import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TEXTS, type Language } from "../constants/texts";
import type { Unit } from "../components/models/recipe";
import { ArrowBackIcon, HeartIcon } from "../components/ui/icons";

type Props = { lang: Language };

type RecipeDetail = {
  id: number;
  title: string;
  description: string;
  rating?: number;
  timeMinutes: number;
  servings: number;
  images?: string[];
  ingredients: { name: string; amount: string; unit: Unit }[];
  steps: string[];
};

type Comment = {
  id: number;
  author: string;
  rating?: number;
  text: string;
  createdAt: string;
};

export default function RecipeDetailPage({ lang }: Props) {
  const t = TEXTS[lang];
  const d = t.recipeDetail;
  const f = t.createRecipe.form;

  const [isFavorite, setIsFavorite] = useState(false);

  const params = useParams();
  const id = Number(params.id);

  const recipes: RecipeDetail[] = useMemo(
    () => [
      {
        id: 1,
        title: "Creamy Mushroom Pasta",
        description: "Quick creamy pasta with mushrooms.",
        rating: 4.6,
        timeMinutes: 30,
        servings: 2,
        images: [
          "/images/default-recipe.png",
          "/images/default-recipe.png",
          "/images/default-recipe.png",
          "/images/default-recipe.png",
          "/images/default-recipe.png",
        ],
        ingredients: [
          { name: "Pasta", amount: "200", unit: "GRAM" },
          { name: "Mushrooms", amount: "150", unit: "GRAM" },
          { name: "Cream", amount: "200", unit: "MILLILITER" },
          { name: "Pasta", amount: "200", unit: "GRAM" },
          { name: "Mushrooms", amount: "150", unit: "GRAM" },
          { name: "Cream", amount: "200", unit: "MILLILITER" },
          { name: "Pasta", amount: "200", unit: "GRAM" },
          { name: "Mushrooms", amount: "150", unit: "GRAM" },
          { name: "Cream", amount: "200", unit: "MILLILITER" },
        ],
        steps: [
          "Boil pasta.",
          "Fry mushrooms.",
          "Add cream and combine.",
          "Fry mushrooms.",
          "Add cream and combine.",
          "Fry mushrooms.",
          "Add cream and combine.",
        ],
      },
    ],
    [],
  );

  const recipe = recipes.find((r) => r.id === id);

  const [activeImg, setActiveImg] = useState(0);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Nadya",
      rating: 5,
      text: "So creamy 😭🔥 Will cook again.",
      createdAt: "2026-02-08",
    },
    {
      id: 2,
      author: "Klara",
      rating: 4,
      text: "Good, but I added garlic and it was even better.",
      createdAt: "2026-02-07",
    },
  ]);

  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState<number>(5);

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

  const images = recipe.images ?? [];
  const hasImages = images.length > 0;
  const safeActiveImg = Math.min(activeImg, Math.max(0, images.length - 1));
  const currentImage = hasImages ? images[safeActiveImg] : null;

  const avgRatingText =
    typeof recipe.rating === "number" ? `${recipe.rating} ★` : d.meta.noRating;

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
          <span className="recipe-detail__meta-item">{avgRatingText}</span>
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

          {hasImages ? (
            <div className="recipe-detail__gallery-grid">
              <div className="recipe-detail__gallery-main">
                <img
                  src={currentImage!}
                  alt={d.aria.mainPhotoAlt(recipe.title)}
                  className="recipe-detail__image"
                  loading="lazy"
                />
              </div>

              <div className="recipe-detail__thumbnails">
                {images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`recipe-detail__thumb ${
                      i === safeActiveImg ? "recipe-detail__thumb--active" : ""
                    }`}
                    onClick={() => setActiveImg(i)}
                    aria-label={d.aria.thumbAlt(i + 1)}
                  >
                    <img
                      src={src}
                      alt={d.aria.thumbAlt(i + 1)}
                      className="recipe-detail__thumb-img"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="recipe-detail__empty">{d.hints.noPhotos}</div>
          )}
        </section>

        <div className="recipe-detail__content">
          {recipe.description ? (
            <p className="recipe-detail__description">{recipe.description}</p>
          ) : null}

          <section className="recipe-detail__section">
            <h3 className="recipe-detail__section-title">
              {f.sections.ingredients}
            </h3>

            <ul className="recipe-detail__ingredients">
              {recipe.ingredients.map((ing, idx) => (
                <li className="recipe-detail__ingredient" key={idx}>
                  <div className="recipe-detail__ingredient-amount--wrapper">
                    <span className="recipe-detail__ingredient-amount">
                      {ing.amount}
                    </span>{" "}
                    <span className="recipe-detail__ingredient-unit">
                      {f.units[ing.unit]}
                    </span>{" "}
                  </div>
                  <span className="recipe-detail__ingredient-name">
                    {ing.name}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Steps */}
          <section className="recipe-detail__section">
            <h3 className="recipe-detail__section-title">{f.sections.steps}</h3>

            <ol className="recipe-detail__steps">
              {recipe.steps.map((s, idx) => (
                <li className="recipe-detail__step" key={idx}>
                  <span className="recipe-detail__step-index">{idx + 1}</span>
                  <span className="recipe-detail__step-text">{s}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      {/* Comments */}
      <section className="recipe-detail__comments">
        <div className="recipe-detail__comments-head">
          <h3 className="recipe-detail__section-title">
            {d.sections.comments}
          </h3>
          <span className="recipe-detail__comments-count">
            {d.meta.commentsCount(comments.length)}
          </span>
        </div>

        <form
          className="recipe-detail__comment-form"
          onSubmit={(e) => {
            e.preventDefault();
            const text = commentText.trim();
            if (!text) return;

            setComments((prev) => [
              {
                id: Date.now(),
                author: d.meta.you,
                rating: commentRating,
                text,
                createdAt: new Date().toISOString().slice(0, 10),
              },
              ...prev,
            ]);
            setCommentText("");
            setCommentRating(5);
          }}
        >
          <div className="recipe-detail__comment-form-row">
            <label className="recipe-detail__label">
              {d.fields.rating}
              <select
                className="recipe-detail__select"
                value={commentRating}
                onChange={(e) => setCommentRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>
                    {v} ★
                  </option>
                ))}
              </select>
            </label>

            <label className="recipe-detail__label recipe-detail__label--grow">
              {d.fields.comment}
              <textarea
                className="recipe-detail__textarea"
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={d.placeholders.comment}
              />
            </label>
          </div>

          <div className="recipe-detail__comment-actions">
            <button type="submit" className="recipe-detail__btn">
              {d.actions.sendComment}
            </button>
          </div>
        </form>

        <div className="recipe-detail__comment-list">
          {comments.length === 0 ? (
            <div className="recipe-detail__empty">{d.hints.noComments}</div>
          ) : (
            comments.map((c) => (
              <article className="recipe-detail__comment" key={c.id}>
                <div className="recipe-detail__comment-head">
                  <div className="recipe-detail__comment-author">
                    {c.author}
                  </div>
                  <div className="recipe-detail__comment-meta">
                    {typeof c.rating === "number" ? `${c.rating} ★` : null}
                    <span className="recipe-detail__dot">•</span>
                    <span>{c.createdAt}</span>
                  </div>
                </div>
                <p className="recipe-detail__comment-text">{c.text}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </section>
  );
}