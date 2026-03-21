import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeForm } from "../components/recipes/RecipeForm";
import { TEXTS, type Language } from "../constants/texts";
import { createRecipe } from "../api/recipes";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { type UnitSystem } from "../utils/unitConverter";

type Props = { lang: Language };

export default function CreateRecipePage({ lang }: Props) {
  const t = TEXTS[lang];
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const uploadedImages = [];

      if (data.images && data.images.length > 0) {
        for (const file of data.images) {
          const formData = new FormData();
          formData.append("file", file);

          const res = await api.post("/api/recipes/images/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });

          uploadedImages.push({ url: res.data.url });
        }
      }

      const payload = {
        ...data,
        images: uploadedImages
      };

      await createRecipe(payload);
      navigate("/my-recipes");
    } catch (error) {
      console.error("Submission error:", error);
      alert(t.profile.loadError || "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const unitSystem: UnitSystem =
    user?.userSettingsDTO?.measurementUnitSystem === "IMPERIAL"
      ? "IMPERIAL"
      : "METRIC";

  if (isLoading) {
    return (
      <section className="create-recipe">
        <h2 className="create-recipe__title">{t.createRecipe.createRecipe}</h2>
        <p>{t.profile.loading}</p>
      </section>
    );
  }

  return (
    <section className="create-recipe">
      <h2 className="create-recipe__title">{t.createRecipe.createRecipe}</h2>

      <RecipeForm
        lang={lang}
        onSubmit={handleSubmit}
        categories={categories}
        unitSystem={unitSystem}
        submitLabel={isSubmitting ? "..." : t.createRecipe.form.actions.submit}
      />
    </section>
  );
}