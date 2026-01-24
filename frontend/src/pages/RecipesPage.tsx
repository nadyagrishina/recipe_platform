import { TEXTS, type Language } from "../constants/texts";
import { RecipeCard } from "../components/recipes/RecipeCard";
import type { RecipeCardData } from "../components/models/recipe";

type Props = {
  lang: Language;
};

export default function RecipesPage({ lang }: Props) {
  const t = TEXTS[lang];

  const recipes: RecipeCardData[] = [
    {
      id: 1,
      title: "Creamy Mushroom ",
      rating: 4.6,
      time: 30,
    },
    {
      id: 2,
      title: "Creamy Mushroom Pasta",
      rating: 4.6,
      time: 30,
    },
    {
      id: 3,
      title: "Creamy Mushroom Pasta",
      rating: 4.6,
      time: 30,
    },
    {
      id: 1,
      title: "Creamy Mushroom ",
      rating: 4.6,
      time: 30,
    },
    {
      id: 2,
      title: "Creamy Mushroom Pasta",
      rating: 4.6,
      time: 30,
    },
    {
      id: 3,
      title: "Creamy Mushroom Pasta",
      rating: 4.6,
      time: 30,
    },
    {
      id: 1,
      title: "Creamy Mushroom ",
      rating: 4.6,
      time: 30,
    },
    {
      id: 2,
      title: "Creamy Mushroom Pasta",
      rating: 4.6,
      time: 30,
    },
    {
      id: 3,
      title: "Creamy Mushroom Pasta",
      rating: 4.6,
      time: 30,
    },
  ];

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
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </main>
        </div>

        <aside className="recipes__filters">
          <h3 className="recipes__filters--title">{t.categories.filters}</h3>

          {/* Categories */}
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

          {/* Diet */}
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

          {/* Preparation time */}
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

          {/* Rating */}
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
