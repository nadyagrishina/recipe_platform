import Logo from "./Logo";
import Navigation from "./Navigation";
import { TEXTS, type Language } from "../../constants/texts";
import { Link } from "react-router-dom";
import LanguageButton from "./LanguageButton";
import { useAuth } from "../../context/AuthContext";

type Props = {
  lang: Language;
  setLang: (lang: Language) => void;
};

export default function Header({ lang, setLang }: Props) {
  const t = TEXTS[lang];
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header__top">
        <Logo subtext={t.header.logoSubtext} />

        <div className="header__buttons">
          <LanguageButton lang={lang} setLang={setLang} />

          {user ? (
            <Link className="header__button header__button--profile" to="/profile">
              {t.header.profileButton}
            </Link>
          ) : (
            <Link className="header__button header__button--login" to="/login">
              {t.header.loginButton}
            </Link>
          )}
        </div>
      </div>
      <Navigation lang={lang} />
    </header>
  );
}