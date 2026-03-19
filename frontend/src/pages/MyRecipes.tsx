import { useEffect, useState } from "react";
import { TEXTS, type Language } from "../constants/texts";
import { getMyRecipes } from "../api/recipes";
import { RecipeCard } from "../components/recipes/RecipeCard";

type Props = { lang: Language };

export default function MyRecipes({ lang }: Props) {
  const t = TEXTS[lang];
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMyRecipes() {
      try {
        setLoading(true);
        const params = {
          page: 0,
          size: 50,
          authorOnly: true 
        };
        const res = await getMyRecipes();
        setRecipes(res.data.content);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadMyRecipes();
  }, []);

  return (
    <section className="my-recipes">
      <h2 className="my-recipes__title">{t.navigation.my}</h2>

      <div className="my-recipes__content">
        {loading ? (
          <p>{t.profile.loading}</p>
        ) : recipes.length > 0 ? (
          <div className="recipes__list">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p className="my-recipes__empty">{t.profile.noRecipes}</p>
        )}
      </div>
    </section>
  );
}