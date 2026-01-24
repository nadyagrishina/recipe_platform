import { Outlet } from "react-router-dom";
import { TEXTS, type Language } from "../constants/texts";
import LanguageButton from "../components/global/LanguageButton";
import Logo from "../components/global/Logo";

type Props = {
  lang: Language;
  setLang: (lang: Language) => void;
};

export default function AuthLayout({ lang, setLang }: Props) {
  const t = TEXTS[lang];

  return (
    <div className="auth">
      <main className="auth__main">
        <div className="auth__header">
          <Logo subtext={t.header.logoSubtext} />
          <LanguageButton lang={lang} setLang={setLang} />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
