import React, { useCallback, useId, useMemo, useRef, useState } from "react";
import type {
  IngredientFormItem,
  RecipeFormData,
  Unit,
} from "../models/recipe";
import { TEXTS, type Language } from "../../constants/texts";
import { CrossIcon } from "../ui/icons";

type Props = {
  initialData?: Partial<RecipeFormData>;
  onSubmit: (data: RecipeFormData) => void;
  submitLabel?: string;
  lang: Language;
};

type CategoryOption = { value: string; label: string };

function normalizeList(list: string[] | undefined, fallback: string[] = [""]) {
  const normalized = (list ?? fallback).map((v) => v ?? "");
  return normalized.length ? normalized : [""];
}

function normalizeIngredients(
  list: IngredientFormItem[] | undefined,
): IngredientFormItem[] {
  if (!list || list.length === 0) {
    return [{ name: "", amount: "", unit: "" }];
  }

  return list.map((v) => ({
    name: v?.name ?? "",
    amount: v?.amount ?? "",
    unit: v?.unit ?? "",
  }));
}

export function RecipeForm({
  initialData = {},
  onSubmit,
  submitLabel,
  lang,
}: Props) {
  const t = TEXTS[lang];
  const f = t.createRecipe.form;

  const formId = useId();

  const [name, setName] = useState(initialData.name ?? "");
  const [description, setDescription] = useState(initialData.description ?? "");
  const [time, setTime] = useState<number>(
    initialData.preparationTimeMinutes ?? 1,
  );
  const [servings, setServings] = useState<number>(initialData.servings ?? 1);
  const [categoryId, setCategoryId] = useState<string>(
    initialData.categoryId ? String(initialData.categoryId) : "",
  );

  const [ingredients, setIngredients] = useState<IngredientFormItem[]>(
    normalizeIngredients(initialData.ingredients),
  );

  const [steps, setSteps] = useState<string[]>(
    normalizeList(initialData.steps),
  );
  const [images, setImages] = useState<File[]>([]);

  const categories: CategoryOption[] = useMemo(
    () => [
      { value: "1", label: t.tags.breakfast },
      { value: "2", label: t.tags.lunch },
      { value: "3", label: t.tags.dinner },
      { value: "4", label: t.tags.desserts },
      { value: "5", label: t.tags.snacks },
    ],
    [t],
  );

  const unitOptions = useMemo(
    () => [
      { value: "GRAM" as const, label: f.units.GRAM },
      { value: "KILOGRAM" as const, label: f.units.KILOGRAM },
      { value: "MILLILITER" as const, label: f.units.MILLILITER },
      { value: "LITER" as const, label: f.units.LITER },
      { value: "TEASPOON" as const, label: f.units.TEASPOON },
      { value: "TABLESPOON" as const, label: f.units.TABLESPOON },
      { value: "CUP" as const, label: f.units.CUP },
      { value: "PIECE" as const, label: f.units.PIECE },
    ],
    [f.units],
  );

  const updateListValue = useCallback(
    (
      index: number,
      value: string,
      list: string[],
      setList: (v: string[]) => void,
    ) => {
      const next = [...list];
      next[index] = value;
      setList(next);
    },
    [],
  );

  const ensureTrailingEmpty = useCallback(
    (index: number, list: string[], setList: (v: string[]) => void) => {
      const isLast = index === list.length - 1;
      const hasText = list[index].trim().length > 0;
      if (isLast && hasText) setList([...list, ""]);
    },
    [],
  );

  const removeListItem = useCallback(
    (index: number, list: string[], setList: (v: string[]) => void) => {
      const next = list.filter((_, i) => i !== index);
      setList(next.length ? next : [""]);
    },
    [],
  );

  const updateIngredient = useCallback(
    (index: number, patch: Partial<IngredientFormItem>) => {
      setIngredients((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], ...patch };
        return next;
      });
    },
    [],
  );

  const ensureTrailingEmptyIngredient = useCallback((index: number) => {
    setIngredients((prev) => {
      const isLast = index === prev.length - 1;
      if (!isLast) return prev;

      const row = prev[index];
      const hasName = row.name.trim().length > 0;

      if (!hasName) return prev;
      return [...prev, { name: "", amount: "", unit: "" }];
    });
  }, []);

  const removeIngredient = useCallback((index: number) => {
    setIngredients((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [{ name: "", amount: "", unit: "" }];
    });
  }, []);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const normalizedIngredients = ingredients
        .map((x) => ({
          name: x.name.trim(),
          amount: x.amount.trim(),
          unit: x.unit,
        }))
        .filter((x) => x.name.length > 0);

      onSubmit({
        name: name.trim(),
        description: description.trim(),
        preparationTimeMinutes: time,
        servings,
        categoryId,
        ingredients: normalizedIngredients,
        steps: steps.map((x) => x.trim()).filter(Boolean),
        images,
      });
    },
    [
      onSubmit,
      name,
      description,
      time,
      servings,
      categoryId,
      ingredients,
      steps,
      images,
    ],
  );

  return (
    <form className="create-recipe__form" onSubmit={handleSubmit}>
      <div className="create-recipe__grid">
        <div className="create-recipe__col create-recipe__col--left">
          <fieldset className="create-recipe__section create-recipe__panel create-recipe__panel--images">
            <legend className="create-recipe__legend">
              {f.sections.images}
            </legend>

            <div className="create-recipe__field">
              <label className="create-recipe__label">
                {f.fields.uploadImages}
              </label>

              <div className="create-recipe__file-actions">
                <label className="create-recipe__file-upload">
                  <input
                    ref={fileInputRef}
                    id={`${formId}-images`}
                    className="create-recipe__file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      e.target.files && setImages(Array.from(e.target.files))
                    }
                  />

                  <span className="create-recipe__file-button">
                    {images.length
                      ? `${f.hints.imagesSelected}: ${images.length}`
                      : f.hints.imagesEmpty}
                  </span>
                </label>

                {images.length > 0 && (
                  <button
                    type="button"
                    className="create-recipe__file-clear"
                    onClick={() => {
                      setImages([]);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    {f.actions.clearImages}
                  </button>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="create-recipe__section create-recipe__panel create-recipe__panel--info">
            <legend className="create-recipe__legend">
              {f.sections.basic}
            </legend>

            <div className="create-recipe__field">
              <label
                className="create-recipe__label"
                htmlFor={`${formId}-name`}
              >
                {f.fields.name}
              </label>
              <input
                id={`${formId}-name`}
                className="create-recipe__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={f.placeholders.name}
                minLength={2}
                required
              />
            </div>

            <div className="create-recipe__field">
              <label
                className="create-recipe__label"
                htmlFor={`${formId}-desc`}
              >
                {f.fields.description}
              </label>
              <textarea
                id={`${formId}-desc`}
                className="create-recipe__textarea create-recipe__textarea--description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={f.placeholders.description}
              />
            </div>

            <div className="create-recipe__row">
              <div className="create-recipe__field">
                <label
                  className="create-recipe__label"
                  htmlFor={`${formId}-time`}
                >
                  {f.fields.time}
                </label>
                <input
                  id={`${formId}-time`}
                  className="create-recipe__input"
                  type="number"
                  min={1}
                  value={time}
                  onChange={(e) => setTime(Number(e.target.value))}
                  required
                />
              </div>

              <div className="create-recipe__field">
                <label
                  className="create-recipe__label"
                  htmlFor={`${formId}-servings`}
                >
                  {f.fields.servings}
                </label>
                <input
                  id={`${formId}-servings`}
                  className="create-recipe__input"
                  type="number"
                  min={1}
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  required
                />
              </div>

              <div className="create-recipe__field">
                <label
                  className="create-recipe__label"
                  htmlFor={`${formId}-cat`}
                >
                  {f.fields.category}
                </label>
                <select
                  id={`${formId}-cat`}
                  className="create-recipe__select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">{f.placeholders.category}</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="create-recipe__col create-recipe__col--right">
          <fieldset className="create-recipe__section create-recipe__panel create-recipe__panel--ingredients">
            <legend className="create-recipe__legend">
              {f.sections.ingredients}
            </legend>

            <div className="create-recipe__hint">{f.hints.ingredients}</div>

            <div className="create-recipe__list">
              {ingredients.map((row, i) => {
                const disableRemove =
                  ingredients.length === 1 &&
                  !row.name.trim() &&
                  !row.amount.trim() &&
                  !row.unit.trim();

                return (
                  <div
                    className="create-recipe__list-item--ingredients"
                    key={`ing-${i}`}
                  >
                    <input
                      className="create-recipe__input create-recipe__input--ingredient"
                      value={row.name}
                      placeholder={f.placeholders.ingredient}
                      onChange={(e) =>
                        updateIngredient(i, { name: e.target.value })
                      }
                      onBlur={() => ensureTrailingEmptyIngredient(i)}
                    />

                    <input
                      className="create-recipe__input create-recipe__input--amount"
                      value={row.amount}
                      inputMode="decimal"
                      placeholder={f.placeholders.amount ?? "Amount"}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const cleaned = raw
                          .replace(",", ".")
                          .replace(/[^\d.]/g, "")
                          .replace(/^(\d*\.?\d{0,2}).*$/, "$1");
                        updateIngredient(i, { amount: cleaned });
                      }}
                    />

                    <select
                      className="create-recipe__select create-recipe__select--unit"
                      value={row.unit}
                      onChange={(e) =>
                        updateIngredient(i, { unit: e.target.value as Unit })
                      }
                      required={row.name.trim().length > 0}
                    >
                      <option value="">{f.placeholders.unit ?? "Unit"}</option>
                      {unitOptions.map((u) => (
                        <option key={u.value} value={u.value}>
                          {u.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="create-recipe__icon-btn"
                      aria-label={f.aria.removeIngredient}
                      onClick={() => removeIngredient(i)}
                      disabled={disableRemove}
                      title={f.titles.remove}
                    >
                      <CrossIcon className="icon-md create-recipe__icon-btn--cross" />
                    </button>
                  </div>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="create-recipe__section create-recipe__panel create-recipe__panel--steps">
            <legend className="create-recipe__legend">
              {f.sections.steps}
            </legend>

            <div className="create-recipe__list">
              {steps.map((val, i) => (
                <div className="create-recipe__list-item--steps" key={`step-${i}`}>
                  <textarea
                    className="create-recipe__textarea
                    create-recipe__textarea--step"
                    rows={2}
                    value={val}
                    placeholder={`${f.placeholders.step} ${i + 1}`}
                    onChange={(e) =>
                      updateListValue(i, e.target.value, steps, setSteps)
                    }
                    onBlur={() => ensureTrailingEmpty(i, steps, setSteps)}
                  />

                  <button
                    type="button"
                    className="create-recipe__icon-btn"
                    aria-label={f.aria.removeStep}
                    onClick={() => removeListItem(i, steps, setSteps)}
                    disabled={steps.length === 1 && !steps[0].trim()}
                    title={f.titles.remove}
                  >
                    <CrossIcon className="icon-md create-recipe__icon-btn--cross" />
                  </button>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="create-recipe__actions">
        <button type="submit" className="create-recipe__submit">
          {submitLabel ?? f.actions.submit}
        </button>
      </div>
    </form>
  );
}
