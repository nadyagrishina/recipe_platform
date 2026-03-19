import { useEffect, useState } from "react";
import { getFavoriteRecipes, generateShoppingList } from "../api/recipes";
import { TEXTS, type Language } from "../constants/texts";

type Props = {
  lang: Language;
};

interface ShoppingItem {
  name: string;
  amount: number;
  unit: string;
}

export default function ShoppingListPage({ lang }: Props) {
  const t = TEXTS[lang];
  const [favorites, setFavorites] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFavoriteRecipes().then((res) => setFavorites(res.data));
  }, []);

  const toggleRecipe = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (selectedIds.length === 0) return;

    setLoading(true);
    try {
      const res = await generateShoppingList(selectedIds);
      setShoppingList(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="shopping-list">
      <h2 className="shopping-list__title">
        {t.navigation.favorites}
      </h2>

      <div className="shopping-list__grid">
        <aside className="shopping-list__selection">
          <ul className="shopping-list__recipes-pick">
            {favorites.map((recipe) => (
              <li key={recipe.id} className="shopping-list__recipe-option">
                <label className="shopping-list__label">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(recipe.id)}
                    onChange={() => toggleRecipe(recipe.id)}
                  />
                  {recipe.name}
                </label>
              </li>
            ))}
          </ul>

          <button
            className="shopping-list__generate-btn"
            onClick={handleGenerate}
            disabled={selectedIds.length === 0 || loading}
          >
            {loading ? t.profile.loading : "Generate"}
          </button>
        </aside>

        <main className="shopping-list__results">
          {shoppingList.length > 0 && (
            <ul className="shopping-list__items">
              {shoppingList.map((item, index) => (
                <li key={index} className="shopping-list__item">
                  <span className="shopping-list__item-name">{item.name}</span>
                  <span className="shopping-list__item-amount">
                    {item.amount}{" "}
                    {t.createRecipe.form.units[
                      item.unit as keyof typeof t.createRecipe.form.units
                    ]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </section>
  );
}