import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/global/Header";
import HeroPage from "./pages/HeroPage";
import { Language } from "./constants/texts";

export default function App() {
  const [lang, setLang] = useState<Language>("cz");

  return (
    <div className="app">
      <Header lang={lang} setLang={setLang} />

      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<HeroPage lang={lang} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
