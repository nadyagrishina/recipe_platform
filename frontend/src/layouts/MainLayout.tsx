import { Outlet } from "react-router-dom";
import Header from "../components/global/Header";
import { Language } from "../constants/texts";

type Props = {
  lang: Language;
  setLang: (lang: Language) => void;
};

export default function MainLayout({ lang, setLang }: Props) {
  return (
    <div className="app">
      <Header lang={lang} setLang={setLang} />

      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
