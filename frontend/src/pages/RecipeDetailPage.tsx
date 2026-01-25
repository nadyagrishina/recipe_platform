import { TEXTS, type Language } from "../constants/texts";

type Props = {
  lang: Language;
};

export default function RecipeDetailPage({ lang }: Props) {
  const t = TEXTS[lang];

  return (
    <section className="recipe-detail">
      <div className="recipe-detail__header">
        <h2 className="recipe-detail__title">Recipe detail</h2>
      </div>

      <div className="recipe-detail__content">
      </div>
    </section>
  );
}
