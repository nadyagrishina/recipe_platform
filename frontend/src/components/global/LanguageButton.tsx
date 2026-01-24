import { TEXTS, type Language } from "../../constants/texts";

type Props = {
  lang: Language;
  setLang: (lang: Language) => void;
};

export default function LanguageButton({ lang, setLang }: Props) {
  const t = TEXTS[lang];

  return (
    <button
      type="button"
      className="header__button header__button--language"
      onClick={() => setLang(lang === "cz" ? "en" : "cz")}
    >
      {lang === "cz" ? t.header.languageCz : t.header.languageEn}
    </button>
  );
}
