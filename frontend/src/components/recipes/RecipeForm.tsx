import React, { useCallback, useId, useMemo, useRef, useState } from "react";
import {
  IngredientFormItem,
  RecipeFormData,
  Unit,
} from "../../types/api";
import { TEXTS, type Language } from "../../constants/texts";
import { CrossIcon } from "../ui/icons";

type Props = {
  initialData?: Partial<RecipeFormData>;
  onSubmit: (data: RecipeFormData) => void;
  submitLabel?: string;
  lang: Language;
};

type CategoryOption = { value: string; label: string };

function normalizeList(list: any[] | undefined) {
  if (!list || list.length === 0) return [""];
  return list.map(v => typeof v === 'string' ? v : v.description || "");
}

function normalizeIngredients(list: IngredientFormItem[] | undefined): IngredientFormItem[] {
  if (!list || list.length === 0) {
    return [{ name: "", amount: "", unit: "" as any }];
  }
  return list.map((v) => ({
    name: v?.name ?? "",
    amount: String(v?.amount ?? ""),
    unit: v?.unit ?? ("" as any),
  }));
}

export function RecipeForm({ initialData = {}, onSubmit, submitLabel, lang }: Props) {
  const t = TEXTS[lang];
  const f = t.createRecipe.form;
  const formId = useId();

  const [name, setName] = useState(initialData.name ?? "");
  const [description, setDescription] = useState(initialData.description ?? "");
  const [time, setTime] = useState<number>(initialData.preparationTimeMinutes ?? 1);
  const [servings, setServings] = useState<number>(initialData.servings ?? 1);
  const [categoryId, setCategoryId] = useState<string>(initialData.categoryId ? String(initialData.categoryId) : "");
  const [ingredients, setIngredients] = useState<IngredientFormItem[]>(normalizeIngredients(initialData.ingredients as any));
  const [steps, setSteps] = useState<string[]>(normalizeList(initialData.steps as any));
  const [images, setImages] = useState<File[]>([]);

  const categories: CategoryOption[] = useMemo(() => [
    { value: "1", label: t.tags.breakfast },
    { value: "2", label: t.tags.lunch },
    { value: "3", label: t.tags.dinner },
    { value: "4", label: t.tags.desserts },
    { value: "5", label: t.tags.snacks },
  ], [t]);

  const unitOptions = useMemo(() => [
    { value: "GRAM" as const, label: f.units.GRAM },
    { value: "KILOGRAM" as const, label: f.units.KILOGRAM },
    { value: "MILLILITER" as const, label: f.units.MILLILITER },
    { value: "LITER" as const, label: f.units.LITER },
    { value: "TEASPOON" as const, label: f.units.TEASPOON },
    { value: "TABLESPOON" as const, label: f.units.TABLESPOON },
    { value: "CUP" as const, label: f.units.CUP },
    { value: "PIECE" as const, label: f.units.PIECE },
  ], [f.units]);

  const updateListValue = (index: number, value: string) => {
    const next = [...steps];
    next[index] = value;
    setSteps(next);
  };

  const ensureTrailingEmpty = (index: number) => {
    if (index === steps.length - 1 && steps[index].trim().length > 0) {
      setSteps([...steps, ""]);
    }
  };

  const removeListItem = (index: number) => {
    const next = steps.filter((_, i) => i !== index);
    setSteps(next.length ? next : [""]);
  };

  const updateIngredient = (index: number, patch: Partial<IngredientFormItem>) => {
    const next = [...ingredients];
    next[index] = { ...next[index], ...patch };
    setIngredients(next);
  };

  const ensureTrailingEmptyIngredient = (index: number) => {
    if (index === ingredients.length - 1 && ingredients[index].name.trim().length > 0) {
      setIngredients([...ingredients, { name: "", amount: "", unit: "" as any }]);
    }
  };

  const removeIngredient = (index: number) => {
    const next = ingredients.filter((_, i) => i !== index);
    setIngredients(next.length ? next : [{ name: "", amount: "", unit: "" as any }]);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      preparationTimeMinutes: time,
      servings,
      categoryId: Number(categoryId),
      ingredients: ingredients
        .filter(x => x.name.trim().length > 0)
        .map(x => ({ ...x, amount: parseFloat(String(x.amount)) || 0 })) as any,
      steps: steps
        .filter(x => x.trim().length > 0)
        .map((x, i) => ({ stepNumber: i + 1, description: x.trim() })) as any,
      images,
    });
  };

  return (
    <form className="create-recipe__form" onSubmit={handleSubmit}>
      <div className="create-recipe__grid">
        <div className="create-recipe__col create-recipe__col--left">
          <fieldset className="create-recipe__section create-recipe__panel create-recipe__panel--images">
            <legend className="create-recipe__legend">{f.sections.images}</legend>
            <div className="create-recipe__field">
              <label className="create-recipe__label">{f.fields.uploadImages}</label>
              <div className="create-recipe__file-actions">
                <label className="create-recipe__file-upload">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => e.target.files && setImages(Array.from(e.target.files))}
                    hidden
                  />
                  <span className="create-recipe__file-button">
                    {images.length ? `${f.hints.imagesSelected}: ${images.length}` : f.hints.imagesEmpty}
                  </span>
                </label>
                {images.length > 0 && (
                  <button type="button" className="create-recipe__file-clear" onClick={() => setImages([])}>
                    {f.actions.clearImages}
                  </button>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="create-recipe__section create-recipe__panel create-recipe__panel--info">
            <legend className="create-recipe__legend">{f.sections.basic}</legend>
            <div className="create-recipe__field">
              <label className="create-recipe__label" htmlFor={`${formId}-name`}>{f.fields.name}</label>
              <input id={`${formId}-name`} className="create-recipe__input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="create-recipe__field">
              <label className="create-recipe__label" htmlFor={`${formId}-desc`}>{f.fields.description}</label>
              <textarea id={`${formId}-desc`} className="create-recipe__textarea" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="create-recipe__row">
              <div className="create-recipe__field">
                <label className="create-recipe__label">{f.fields.time}</label>
                <input className="create-recipe__input" type="number" value={time} onChange={(e) => setTime(Number(e.target.value))} required />
              </div>
              <div className="create-recipe__field">
                <label className="create-recipe__label">{f.fields.servings}</label>
                <input className="create-recipe__input" type="number" value={servings} onChange={(e) => setServings(Number(e.target.value))} required />
              </div>
              <div className="create-recipe__field">
                <label className="create-recipe__label">{f.fields.category}</label>
                <select className="create-recipe__select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                  <option value="">{f.placeholders.category}</option>
                  {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="create-recipe__col create-recipe__col--right">
          <fieldset className="create-recipe__section create-recipe__panel create-recipe__panel--ingredients">
            <legend className="create-recipe__legend">{f.sections.ingredients}</legend>
            <div className="create-recipe__list">
              {ingredients.map((row, i) => (
                <div className="create-recipe__list-item--ingredients" key={i}>
                  <input className="create-recipe__input" value={row.name} onChange={(e) => updateIngredient(i, { name: e.target.value })} onBlur={() => ensureTrailingEmptyIngredient(i)} placeholder={f.placeholders.ingredient} />
                  <input className="create-recipe__input create-recipe__input--amount" value={row.amount} onChange={(e) => updateIngredient(i, { amount: e.target.value.replace(",", ".") })} placeholder="0" />
                  <select className="create-recipe__select create-recipe__select--unit" value={row.unit} onChange={(e) => updateIngredient(i, { unit: e.target.value as Unit })}>
                    <option value="">{f.placeholders.unit}</option>
                    {unitOptions.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                  <button type="button" className="create-recipe__icon-btn" onClick={() => removeIngredient(i)} disabled={ingredients.length === 1 && !row.name}>
                    <CrossIcon className="icon-md" />
                  </button>
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className="create-recipe__section create-recipe__panel create-recipe__panel--steps">
            <legend className="create-recipe__legend">{f.sections.steps}</legend>
            <div className="create-recipe__list">
              {steps.map((val, i) => (
                <div className="create-recipe__list-item--steps" key={i}>
                  <textarea className="create-recipe__textarea" rows={2} value={val} onChange={(e) => updateListValue(i, e.target.value)} onBlur={() => ensureTrailingEmpty(i)} placeholder={`${f.placeholders.step} ${i + 1}`} />
                  <button type="button" className="create-recipe__icon-btn" onClick={() => removeListItem(i)} disabled={steps.length === 1 && !val}>
                    <CrossIcon className="icon-md" />
                  </button>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
      <div className="create-recipe__actions">
        <button type="submit" className="create-recipe__submit">{submitLabel ?? f.actions.submit}</button>
      </div>
    </form>
  );
}