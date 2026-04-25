import { useEffect, useState } from "react";
import { TEXTS, type Language } from "../constants/texts";
import { RecipeCard } from "../components/recipes/RecipeCard";
import api from "../api/axios";

type Props = {
  lang: Language;
};

export default function RecipesPage({ lang }: Props) {
  const t = TEXTS[lang];

  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [maxTime, setMaxTime] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);

  const loadRecipes = async (
    customFilters?: {
      query?: string;
      categoryId?: number | null;
      maxTime?: number | null;
      minRating?: number | null;
    }
  ) => {
    try {
      setLoading(true);
      setError(null);

      const currentQuery = customFilters?.query ?? query;
      const currentCategoryId = customFilters?.categoryId ?? categoryId;
      const currentMaxTime = customFilters?.maxTime ?? maxTime;
      const currentMinRating = customFilters?.minRating ?? minRating;

      const hasFilters =
        !!currentQuery.trim() ||
        currentCategoryId !== null ||
        currentMaxTime !== null ||
        currentMinRating !== null;

      const endpoint = hasFilters ? "/api/recipes/search" : "/api/recipes";

      const response = await api.get(endpoint, {
        params: {
          page: 0,
          size: 12,
          query: currentQuery.trim() || undefined,
          categoryId: currentCategoryId ?? undefined,
          maxTime: currentMaxTime ?? undefined,
          minRating: currentMinRating ?? undefined,
        },
      });

      const data = response.data?.content || response.data || [];
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(t.profile.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleApplyFilters = () => {
    loadRecipes();
  };

  const handleClearFilters = () => {
    setQuery("");
    setCategoryId(null);
    setMaxTime(null);
    setMinRating(null);

    loadRecipes({
      query: "",
      categoryId: null,
      maxTime: null,
      minRating: null,
    });
  };

  return (
    <section className="recipes">
      <h2 className="recipes__title">{t.categories.title}</h2>

      <div className="recipes__wrapper">
        <div className="recipes__main">
          <div className="recipes__search">
            <input
              type="text"
              className="recipes__search--input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="recipes__search--btn" onClick={handleApplyFilters}>
              {t.categories.search}
            </button>
          </div>

          <main className="recipes__list">
            {loading && <p>Loading recipes...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && recipes.length === 0 && (
              <p>No recipes found.</p>
            )}
            {!loading &&
              !error &&
              recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
          </main>
        </div>

        <aside className="recipes__filters">
          <h3 className="recipes__filters--title">{t.categories.filters}</h3>

          <h4>{t.categories.categories}</h4>
          <ul className="recipes__filters--list columns-2">
            <li>
              <label>
                <input
                  type="radio"
                  name="category"
                  checked={categoryId === 1}
                  onChange={() => setCategoryId(1)}
                />
                {t.tags.breakfast}
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="category"
                  checked={categoryId === 2}
                  onChange={() => setCategoryId(2)}
                />
                {t.tags.lunch}
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="category"
                  checked={categoryId === 3}
                  onChange={() => setCategoryId(3)}
                />
                {t.tags.dinner}
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="category"
                  checked={categoryId === 9}
                  onChange={() => setCategoryId(9)}
                />
                {t.tags.desserts}
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="category"
                  checked={categoryId === 8}
                  onChange={() => setCategoryId(8)}
                />
                {t.tags.snacks}
              </label>
            </li>
          </ul>

          <h4>{t.categories.diet}</h4>
          <ul className="recipes__filters--list columns-2">
            <li>
              <label>
                <input
                  type="radio"
                  name="category"
                  checked={categoryId === 15}
                  onChange={() => setCategoryId(15)}
                />
                {t.tags.vegan}
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="category"
                  checked={categoryId === 14}
                  onChange={() => setCategoryId(14)}
                />
                {t.tags.vegeterian}
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="category"
                  checked={categoryId === 16}
                  onChange={() => setCategoryId(16)}
                />
                {t.tags.glutenFree}
              </label>
            </li>
          </ul>

          <h4>{t.categories.time}</h4>
          <ul className="recipes__filters--list">
            <li>
              <label>
                <input
                  type="radio"
                  name="time"
                  checked={maxTime === 15}
                  onChange={() => setMaxTime(15)}
                />
                {t.preparationTime.upTo15}
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="time"
                  checked={maxTime === 30}
                  onChange={() => setMaxTime(30)}
                />
                {t.preparationTime.upTo30}
              </label>
            </li>
          </ul>

          <h4>{t.categories.score}</h4>
          <ul className="recipes__filters--list">
            <li>
              <label>
                <input
                  type="radio"
                  name="score"
                  checked={minRating === 4}
                  onChange={() => setMinRating(4)}
                />
                4★ {t.rating.more}
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="score"
                  checked={minRating === 4.5}
                  onChange={() => setMinRating(4.5)}
                />
                4.5★ {t.rating.more}
              </label>
            </li>
          </ul>

          <div className="recipes__buttons">
            <button className="recipes__filters--apply" onClick={handleApplyFilters}>
              {t.categories.applyFilters}
            </button>
            <button className="recipes__filters--clear" onClick={handleClearFilters}>
              {t.categories.clearFilters}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}