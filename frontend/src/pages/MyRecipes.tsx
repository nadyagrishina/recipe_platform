import { TEXTS, type Language } from "../constants/texts";

type Props = { lang: Language };

export default function MyRecipes({ lang }: Props) {
  const t = TEXTS[lang];

  return (
    <section className="my-recipes">
      <h2 className="my-recipes__title">{t.navigation.my}</h2>

      <div className="my-recipes__content">
      </div>
    </section>
  );
}
