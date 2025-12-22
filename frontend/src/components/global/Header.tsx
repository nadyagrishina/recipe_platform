import Logo from "./Logo";
import Navigation from "./Navigation";
import { TEXTS, type Language } from "../../constants/texts";

type Props = {
  lang: Language;
  setLang: (lang: Language) => void;
};

export default function Header({ lang, setLang }: Props) {
  const t = TEXTS[lang];

  return (
    <header className="header">
      <div className="header__top">
        <Logo subtext={t.header.logoSubtext} />

        <div className="header__buttons">
          <button
            type="button"
            className="header__button header__button--language"
            onClick={() => setLang(lang === "cz" ? "en" : "cz")}
          >
            {lang === "cz" ? t.header.languageCz : t.header.languageEn}
          </button>

          <button
            type="button"
            className="header__button header__button--login"
          >
            {t.header.loginButton}
          </button>
        </div>
      </div>

      <Navigation lang={lang} />
    </header>
  );
}
