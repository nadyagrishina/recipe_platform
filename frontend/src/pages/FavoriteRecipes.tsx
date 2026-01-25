import { TEXTS, type Language } from "../constants/texts";

type Props = { lang: Language };

export default function FavoriteRecipes({ lang }: Props) {
  const t = TEXTS[lang];

  return (
    <section className="favorites">
      <h2>Favorite recipes</h2>
    </section>
  );
}
