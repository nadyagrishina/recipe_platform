import { useEffect, useState } from "react";
import { TEXTS, type Language } from "../constants/texts";
import { RecipeCard } from "../components/recipes/RecipeCard";
import type {
  RecipeApiResponse,
  RecipeCardData,
} from "../components/models/recipe";

type Props = {
  lang: Language;
};

export default function RecipesPage({ lang }: Props) {
  const t = TEXTS[lang];

  const [recipes, setRecipes] = useState<RecipeCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecipes() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:8080/api/recipes");

        if (!response.ok) {
          throw new Error(`Failed to fetch recipes: ${response.status}`);
        }

        const data: RecipeApiResponse[] = await response.json();

        const mappedRecipes: RecipeCardData[] = data.map((recipe) => ({
          id: recipe.id,
          title: recipe.name,
          time: recipe.preparationTimeMinutes,
        }));

        setRecipes(mappedRecipes);
      } catch (err) {
        console.error("Failed to load recipes", err);
        setError("Failed to load recipes");
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  return (
    <section className="recipes">
      <h2>{t.categories.title}</h2>

      <div className="recipes__wrapper">
        <div className="recipes__main">
          <div className="recipes__search">
            <input type="text" className="recipes__search--input" />
            <button className="recipes__search--btn">
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
                <input type="checkbox" />
                {t.tags.breakfast}
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                {t.tags.lunch}
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                {t.tags.dinner}
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                {t.tags.desserts}
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                {t.tags.snacks}
              </label>
            </li>
          </ul>

          <h4>{t.categories.diet}</h4>
          <ul className="recipes__filters--list columns-2">
            <li>
              <label>
                <input type="checkbox" />
                {t.tags.vegan}
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                {t.tags.vegeterian}
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                {t.tags.glutenFree}
              </label>
            </li>
          </ul>

          <h4>{t.categories.time}</h4>
          <ul className="recipes__filters--list">
            <li>
              <label>
                <input type="radio" name="time" />
                {t.preparationTime.upTo15}
              </label>
            </li>
            <li>
              <label>
                <input type="radio" name="time" />
                {t.preparationTime.upTo30}
              </label>
            </li>
            <li>
              <label>
                <input type="radio" name="time" />
                {t.preparationTime.moreThan30}
              </label>
            </li>
          </ul>

          <h4>{t.categories.score}</h4>
          <ul className="recipes__filters--list">
            <li>
              <label>
                <input type="radio" name="score" />
                4★ {t.rating.more}
              </label>
            </li>
            <li>
              <label>
                <input type="radio" name="score" />
                4.5★ {t.rating.more}
              </label>
            </li>
          </ul>

          <div className="recipes__buttons">
            <button className="recipes__filters--apply">
              {t.categories.applyFilters}
            </button>
            <button className="recipes__filters--clear">
              {t.categories.clearFilters}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
