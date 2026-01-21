import { RecipeForm } from "../components/recipes/RecipeForm";
import { TEXTS, type Language } from "../constants/texts";
import type { RecipeFormData } from "../components/types/recipe";

type Props = {
  lang: Language;
};

export default function CreateRecipePage({ lang }: Props) {
  const t = TEXTS[lang];

  function handleSubmit(data: RecipeFormData) {
    console.log("Create recipe:", data);
  }

  return (
    <section className="create-recipe">
      <h2>{t.createRecipe.createRecipe}</h2>

      <RecipeForm
        lang={lang}
        onSubmit={handleSubmit}
        submitLabel={t.createRecipe.form.actions.submit}
      />
    </section>
  );
}
