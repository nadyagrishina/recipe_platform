import Logo from "./Logo";
import Navigation from "./Navigation";
import { TEXTS, type Language } from "../../constants/texts";
import { Link } from "react-router-dom";
import LanguageButton from "./LanguageButton";

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
          <LanguageButton lang={lang} setLang={setLang} />

          <Link className="header__button header__button--login" to="/login">
            {t.header.loginButton}
          </Link>
        </div>
      </div>

      <Navigation lang={lang} />
    </header>
  );
}
