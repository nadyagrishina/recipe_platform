import { useEffect, useState } from "react";
import { TEXTS, type Language } from "../constants/texts";
import { RecipeCard } from "../components/recipes/RecipeCard";
import { getFavoriteRecipes } from "../api/recipes";

type Props = { lang: Language };

export default function FavoriteRecipes({ lang }: Props) {
  const t = TEXTS[lang];
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        setLoading(true);
        const res = await getFavoriteRecipes();
        setRecipes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  return (
    <section className="favorites">
      <h2 className="favorites__title">{t.navigation.favorites}</h2>

      <div className="favorites__content">
        {loading ? (
          <p>{t.profile.loading}</p>
        ) : recipes.length > 0 ? (
          <div className="recipes__list">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p className="favorites__empty">{t.profile.noRecipes}</p>
        )}
      </div>
    </section>
  );
}