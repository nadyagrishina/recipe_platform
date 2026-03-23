import React, { useId, useState } from "react";
import { IngredientFormItem, RecipeFormData, Unit } from "../../types/api";
import { TEXTS, type Language } from "../../constants/texts";
import { CrossIcon } from "../ui/icons";
import { type UnitSystem, getAllowedUnits } from "../../utils/unitConverter";

type Props = {
  initialData?: Partial<RecipeFormData>;
  onSubmit: (data: any) => void;
  submitLabel?: string;
  lang: Language;
  categories: any[];
  unitSystem: UnitSystem;
  isEditMode?: boolean;
};

function normalizeList(list: any[] | undefined) {
  if (!list || list.length === 0) return [""];
  return list.map((v) => (typeof v === "string" ? v : v.description || ""));
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

export function RecipeForm({
  initialData = {},
  onSubmit,
  submitLabel,
  lang,
  categories,
  unitSystem,
  isEditMode = false,
}: Props) {
  const t = TEXTS[lang];
  const f = t.createRecipe.form;
  const formId = useId();

  const [name, setName] = useState(initialData.name ?? "");
  const [description, setDescription] = useState(initialData.description ?? "");
  const [time, setTime] = useState<number>(initialData.preparationTimeMinutes ?? 1);
  const [servings, setServings] = useState<number>(initialData.servings ?? 1);
  const [categoryId, setCategoryId] = useState<string>(
    String(
      initialData.categoryId ??
      (initialData as any).category?.id ??
      ""
    )
  );
  const [ingredients, setIngredients] = useState<IngredientFormItem[]>(
    normalizeIngredients(initialData.ingredients as any)
  );
  const [steps, setSteps] = useState<string[]>(normalizeList(initialData.steps as any));
  const [images, setImages] = useState<File[]>([]);

  const updateListValue = (index: number, value: string) => {
    const next = [...steps];
    next[index] = value;
    setSteps(next);

    if (index === next.length - 1 && value.trim().length > 0) {
      setSteps([...next, ""]);
    }
  };

  const removeListItem = (index: number) => {
    const next = steps.filter((_, i) => i !== index);
    setSteps(next.length ? next : [""]);
  };

  const updateIngredient = (index: number, patch: Partial<IngredientFormItem>) => {
    const next = [...ingredients];
    const updatedItem = { ...next[index], ...patch };

    if ((patch.unit as string) === "TO_TASTE") {
      updatedItem.amount = "";
    }

    next[index] = updatedItem;
    setIngredients(next);

    if (index === next.length - 1 && (patch.name?.trim().length ?? 0) > 0) {
      setIngredients([...next, { name: "", amount: "", unit: "" as any }]);
    }
  };

  const removeIngredient = (index: number) => {
    const next = ingredients.filter((_, i) => i !== index);
    setIngredients(next.length ? next : [{ name: "", amount: "", unit: "" as any }]);
  };

  const getUnitOptionsForRow = (currentUnit?: string) => {
    const allowedUnits = getAllowedUnits(unitSystem);

    const units =
      currentUnit && currentUnit.trim().length > 0 && !allowedUnits.includes(currentUnit)
        ? [currentUnit, ...allowedUnits]
        : allowedUnits;

    return units.map((key) => ({
      value: key,
      label: (f.units as any)[key] || key,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalIngredients = ingredients
      .filter((x) => x.name.trim().length > 0)
      .map((x) => ({
        name: x.name.trim(),
        unit: x.unit || "PIECE",
        amount: (x.unit as string) === "TO_TASTE" ? 0 : parseFloat(String(x.amount)) || 0,
      }));

    const finalSteps = steps
      .filter((x) => x.trim().length > 0)
      .map((x, i) => ({
        stepNumber: i + 1,
        description: x.trim(),
      }));

    if (finalIngredients.length === 0) {
      alert(t.profile.loadError || "Add at least one ingredient");
      return;
    }

    const payload: any = {
      name: name.trim(),
      description: description.trim(),
      preparationTimeMinutes: time,
      servings,
      categoryId: Number(categoryId),
      ingredients: finalIngredients,
      steps: finalSteps,
    };

    if (!isEditMode) {
      payload.images = images;
    }

    onSubmit(payload);
  };


  return (
    <form className="create-recipe__form" onSubmit={handleSubmit}>
      <div className="create-recipe__grid">
        <div className="create-recipe__col create-recipe__col--left">
          {!isEditMode && (
            <fieldset className="create-recipe__section create-recipe__panel create-recipe__panel--images">
              <legend className="create-recipe__legend">{f.sections.images}</legend>

              <div className="create-recipe__field">
                <label className="create-recipe__label">{f.fields.uploadImages}</label>

                <div className="create-recipe__file-actions">
                  <label className="create-recipe__file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={(e) => e.target.files && setImages(Array.from(e.target.files))}
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
                      onClick={() => setImages([])}
                    >
                      {f.actions.clearImages}
                    </button>
                  )}
                </div>
              </div>
            </fieldset>
          )}

          <fieldset className="create-recipe__section create-recipe__panel create-recipe__panel--info">
            <legend className="create-recipe__legend">{f.sections.basic}</legend>

            <div className="create-recipe__field">
              <label className="create-recipe__label" htmlFor={`${formId}-name`}>
                {f.fields.name}
              </label>
              <input
                id={`${formId}-name`}
                className="create-recipe__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="create-recipe__field">
              <label className="create-recipe__label" htmlFor={`${formId}-desc`}>
                {f.fields.description}
              </label>
              <textarea
                id={`${formId}-desc`}
                className="create-recipe__textarea create-recipe__textarea--description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="create-recipe__row">
              <div className="create-recipe__field">
                <label className="create-recipe__label">{f.fields.time}</label>
                <input
                  className="create-recipe__input"
                  type="number"
                  min="1"
                  value={time || ''}
                  onChange={(e) => setTime(e.target.value === '' ? 0 : parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="create-recipe__field">
                <label className="create-recipe__label">{f.fields.servings}</label>
                <input
                  className="create-recipe__input"
                  type="number"
                  min="1"
                  value={servings || ''}
                  onChange={(e) => setServings(e.target.value === '' ? 0 : parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="create-recipe__field">
                <label className="create-recipe__label">{f.fields.category}</label>
                <select
                  className="create-recipe__select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">{f.placeholders.category}</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {(t as any).createRecipe.form.categoryCodes?.[c.code] || c.code}
                    </option>
                  ))}
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
                  <input
                    className="create-recipe__input"
                    value={row.name}
                    onChange={(e) => updateIngredient(i, { name: e.target.value })}
                    placeholder={f.placeholders.ingredientName}
                  />

                  <input
                    className="create-recipe__input create-recipe__input--amount"
                    type="text"
                    value={(row.unit as string) === "TO_TASTE" ? "" : row.amount}
                    disabled={(row.unit as string) === "TO_TASTE"}
                    onChange={(e) =>
                      updateIngredient(i, {
                        amount: e.target.value.replace(",", "."),
                      })
                    }
                    placeholder={(row.unit as string) === "TO_TASTE" ? "—" : "0"}
                  />

                  <select
                    className="create-recipe__select create-recipe__select--unit"
                    value={row.unit}
                    onChange={(e) => updateIngredient(i, { unit: e.target.value as Unit })}
                  >
                    <option value="">{f.placeholders.unit}</option>
                    {getUnitOptionsForRow(row.unit).map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="create-recipe__icon-btn"
                    onClick={() => removeIngredient(i)}
                    disabled={ingredients.length === 1 && !row.name}
                  >
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
                  <textarea
                    className="create-recipe__textarea"
                    rows={2}
                    value={val}
                    onChange={(e) => updateListValue(i, e.target.value)}
                    placeholder={`${f.placeholders.step} ${i + 1}`}
                  />

                  <button
                    type="button"
                    className="create-recipe__icon-btn"
                    onClick={() => removeListItem(i)}
                    disabled={steps.length === 1 && !val}
                  >
                    <CrossIcon className="icon-md" />
                  </button>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="create-recipe__actions">
        <button type="submit" className="create-recipe__submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}