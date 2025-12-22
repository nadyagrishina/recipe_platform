import { TEXTS_CZ } from "./cz";
import { TEXTS_EN } from "./en";

export const TEXTS = {
  cz: TEXTS_CZ,
  en: TEXTS_EN,
};

export type Language = keyof typeof TEXTS;
